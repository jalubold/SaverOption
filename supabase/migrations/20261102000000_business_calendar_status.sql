-- Whether a member's calendar feed is in use: when a calendar app last fetched it, and which app
-- (from its user agent; browsers aren't counted). Lets the app say "Connected to Google Calendar"
-- and stop suggesting the calendar to people who already have it. Also when they dismissed that
-- suggestion on the dashboard.
alter table public.biz_memberships
  add column if not exists calendar_fetched_at timestamptz,
  add column if not exists calendar_client text check (calendar_client in ('google', 'apple', 'outlook', 'other')),
  add column if not exists calendar_prompt_dismissed_at timestamptz;
