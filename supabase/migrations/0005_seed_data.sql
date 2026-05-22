-- 0005_seed_data.sql
-- Initial data. Run AFTER you have signed in once via the app so auth.users has an entry.

-- =====================================================================
-- Promote founder to super_admin
-- Replace the email with your founder Google account email, then run.
-- =====================================================================
-- update public.users
--    set is_admin = true,
--        is_super_admin = true
--  where email = 'founder@gography.net';

-- =====================================================================
-- Sample current season (uncomment to use)
-- =====================================================================
-- insert into public.seasons (name, start_date, end_date, status)
-- values ('Spring 2026', '2026-01-01', '2026-04-30', 'active')
-- on conflict do nothing;
