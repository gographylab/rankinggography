-- 0004_functions.sql
-- Cashback eligibility recompute + materialized view refresh helpers.
-- Call from Vercel Cron Functions or pg_cron (see comments).

-- =====================================================================
-- refresh_photo_scores — call every 5 minutes
-- =====================================================================
create or replace function public.refresh_photo_scores()
returns void language plpgsql as $$
begin
  refresh materialized view concurrently public.photo_scores;
exception
  when feature_not_supported then
    -- concurrent refresh requires unique index; fall back to non-concurrent
    refresh materialized view public.photo_scores;
end;
$$;

-- =====================================================================
-- refresh_photographer_stats — call every 6 hours
-- =====================================================================
create or replace function public.refresh_photographer_stats()
returns void language plpgsql as $$
begin
  refresh materialized view concurrently public.photographer_stats;
exception
  when feature_not_supported then
    refresh materialized view public.photographer_stats;
end;
$$;

-- =====================================================================
-- compute_cashback_eligibility — call once daily (2am)
--
-- For each customer:
--   - find best rank across all 3 categories (lowest rank_position by pulse desc)
--   - tier: #1=15%, #2-5=10%, #6-10=5%, #11-50=3%, #51+=0%
--   - upsert active row; deactivate stale rows
-- =====================================================================
create or replace function public.compute_cashback_eligibility()
returns void language plpgsql as $$
declare
  today date := current_date;
begin
  -- Deactivate everything first; we will re-activate winners below.
  update public.cashback_eligibility
     set is_active = false,
         eligible_until = coalesce(eligible_until, today)
   where is_active = true;

  -- Per-category ranking by pulse_score desc
  with ranked as (
    select
      ps.photographer_id        as user_id,
      ps.category,
      row_number() over (partition by ps.category order by ps.pulse_score desc) as rank_position
    from public.photo_scores ps
    join public.users u on u.id = ps.photographer_id
    where u.is_customer = true
  ),
  best as (
    -- Best (lowest) rank per user across all 3 categories
    select distinct on (user_id)
      user_id, category, rank_position
    from ranked
    order by user_id, rank_position asc
  )
  insert into public.cashback_eligibility (user_id, category, rank_position, percentage, eligible_from, is_active)
  select
    b.user_id,
    b.category,
    b.rank_position,
    case
      when b.rank_position = 1 then 15
      when b.rank_position between 2 and 5 then 10
      when b.rank_position between 6 and 10 then 5
      when b.rank_position between 11 and 50 then 3
      else 0
    end as percentage,
    today,
    true
  from best b
  where b.rank_position <= 50;
end;
$$;

-- =====================================================================
-- pg_cron scheduling (optional — uncomment after enabling pg_cron extension)
-- =====================================================================
-- select cron.schedule('refresh-pulse',          '*/5 * * * *', $$select public.refresh_photo_scores()$$);
-- select cron.schedule('refresh-photographer',   '0 */6 * * *', $$select public.refresh_photographer_stats()$$);
-- select cron.schedule('cashback-eligibility',   '0 2 * * *',   $$select public.compute_cashback_eligibility()$$);
