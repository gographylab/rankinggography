-- 0003_materialized_views.sql
-- photo_scores (pulse) + photographer_stats. Refresh schedule set up in 0004.

drop materialized view if exists public.photo_scores;
create materialized view public.photo_scores as
select
  p.id              as photo_id,
  p.photographer_id,
  p.category,
  p.uploaded_at,
  p.pick_type,
  p.likes_count     as total_likes,

  (select count(*) from public.votes v
     where v.photo_id = p.id and v.voted_at > now() - interval '24 hours') as likes_24h,
  (select count(*) from public.votes v
     where v.photo_id = p.id and v.voted_at > now() - interval '7 days') as likes_7d,
  (select count(*) from public.votes v
     where v.photo_id = p.id and v.voted_at > now() - interval '30 days') as likes_30d,

  (
    p.likes_count * 1.0
    + (select count(*) from public.votes v
        where v.photo_id = p.id and v.voted_at > now() - interval '24 hours') * 3.0
    + case
        when p.pick_type = 'both' then 100
        when p.pick_type = 'editor' then 50
        when p.pick_type = 'ambassador' then 50
        else 0
      end
  ) / greatest(extract(epoch from (now() - p.uploaded_at)) / 3600.0, 1.0) as pulse_score,

  extract(epoch from (now() - p.uploaded_at)) / 3600.0 as hours_since_upload

from public.photos p
where p.is_hidden = false and p.status = 'published';

create unique index if not exists photo_scores_pk on public.photo_scores(photo_id);
create index if not exists photo_scores_pulse_idx on public.photo_scores(pulse_score desc);
create index if not exists photo_scores_category_pulse_idx on public.photo_scores(category, pulse_score desc);
create index if not exists photo_scores_photographer_idx on public.photo_scores(photographer_id);

drop materialized view if exists public.photographer_stats;
create materialized view public.photographer_stats as
select
  u.id as user_id,
  count(p.id)                                            as total_photos,
  coalesce(sum(p.likes_count), 0)                        as total_likes,
  coalesce(sum(p.favorites_count), 0)                    as total_favorites,
  coalesce(sum(p.impressions_count), 0)                  as total_impressions,
  coalesce(avg(ps.pulse_score), 0)                       as avg_pulse,
  coalesce(max(ps.pulse_score), 0)                       as peak_pulse,
  count(p.id) filter (where p.pick_type <> 'none')       as picks_received
from public.users u
left join public.photos p on p.photographer_id = u.id and p.is_hidden = false
left join public.photo_scores ps on ps.photo_id = p.id
where u.photographer_status = 'approved'
group by u.id;

create unique index if not exists photographer_stats_pk on public.photographer_stats(user_id);
