-- Saver Option Business: a personal calendar feed (ICS) per member, to subscribe to in Google
-- Calendar, Outlook or Apple Calendar. The token is the secret part of the feed's URL. It belongs
-- to the membership, so someone who leaves a workspace loses the feed with it.
alter table public.biz_memberships
  add column if not exists calendar_token text unique check (calendar_token ~ '^[A-Za-z0-9_-]{32,64}$');
