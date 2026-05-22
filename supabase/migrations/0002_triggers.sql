-- 0002_triggers.sql
-- Auth integration + denormalized counters + pick_type maintenance.

-- =====================================================================
-- handle_new_user — auto-create public.users row on auth signup
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  base_username text;
  final_username text;
  n integer := 0;
begin
  base_username := coalesce(
    new.raw_user_meta_data ->> 'username',
    regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g')
  );
  if length(base_username) < 3 then
    base_username := 'user_' || substr(new.id::text, 1, 4);
  end if;

  final_username := base_username;
  while exists (select 1 from public.users where lower(username) = lower(final_username)) loop
    n := n + 1;
    final_username := base_username || '_' || n::text;
  end loop;

  insert into public.users (id, email, username, display_name, avatar_url, email_verified)
  values (
    new.id,
    new.email,
    final_username,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    coalesce(new.email_confirmed_at is not null, false)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- Counter maintenance — votes / favorites / comments
-- =====================================================================
create or replace function public.update_photo_likes_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update public.photos set likes_count = likes_count + 1 where id = new.photo_id;
  elsif tg_op = 'DELETE' then
    update public.photos set likes_count = greatest(likes_count - 1, 0) where id = old.photo_id;
  end if;
  return null;
end;
$$;

drop trigger if exists tr_votes_count on public.votes;
create trigger tr_votes_count after insert or delete on public.votes
  for each row execute function public.update_photo_likes_count();

create or replace function public.update_photo_favorites_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update public.photos set favorites_count = favorites_count + 1 where id = new.photo_id;
  elsif tg_op = 'DELETE' then
    update public.photos set favorites_count = greatest(favorites_count - 1, 0) where id = old.photo_id;
  end if;
  return null;
end;
$$;

drop trigger if exists tr_favorites_count on public.favorites;
create trigger tr_favorites_count after insert or delete on public.favorites
  for each row execute function public.update_photo_favorites_count();

create or replace function public.update_photo_comments_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update public.photos set comments_count = comments_count + 1 where id = new.photo_id;
  elsif tg_op = 'DELETE' then
    update public.photos set comments_count = greatest(comments_count - 1, 0) where id = old.photo_id;
  end if;
  return null;
end;
$$;

drop trigger if exists tr_comments_count on public.comments;
create trigger tr_comments_count after insert or delete on public.comments
  for each row execute function public.update_photo_comments_count();

-- =====================================================================
-- pick_type maintenance — recompute on editor_picks / ambassador_picks change
-- =====================================================================
create or replace function public.recompute_pick_type(p_photo_id uuid)
returns void language plpgsql as $$
declare
  has_editor boolean;
  has_amb boolean;
  new_type text;
begin
  select exists (select 1 from public.editor_picks where photo_id = p_photo_id) into has_editor;
  select exists (select 1 from public.ambassador_picks where photo_id = p_photo_id) into has_amb;

  new_type := case
    when has_editor and has_amb then 'both'
    when has_editor then 'editor'
    when has_amb then 'ambassador'
    else 'none'
  end;

  update public.photos
     set pick_type = new_type,
         picked_at = case when new_type = 'none' then null else now() end
   where id = p_photo_id;
end;
$$;

create or replace function public.tr_recompute_pick_type()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    perform public.recompute_pick_type(new.photo_id);
  elsif tg_op = 'DELETE' then
    perform public.recompute_pick_type(old.photo_id);
  end if;
  return null;
end;
$$;

drop trigger if exists tr_editor_picks_pick_type on public.editor_picks;
create trigger tr_editor_picks_pick_type after insert or delete on public.editor_picks
  for each row execute function public.tr_recompute_pick_type();

drop trigger if exists tr_ambassador_picks_pick_type on public.ambassador_picks;
create trigger tr_ambassador_picks_pick_type after insert or delete on public.ambassador_picks
  for each row execute function public.tr_recompute_pick_type();
