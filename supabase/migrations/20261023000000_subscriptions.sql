-- Saver Option: listing plans are subscriptions. A listing stays live while its
-- subscription is paid up; verified Lemon Squeezy subscription webhooks keep
-- these columns current. Listings paid once before this change keep their dates.

alter table public.submissions
  add column if not exists subscription_id          text unique,
  add column if not exists subscription_status      text
    check (subscription_status in ('on_trial', 'active', 'paused', 'past_due', 'unpaid', 'cancelled', 'expired')),
  add column if not exists subscription_renews_at   timestamptz,
  add column if not exists subscription_ends_at     timestamptz,
  -- Lemon Squeezy's updated_at of the last applied subscription event, so older events are ignored.
  add column if not exists subscription_updated_at  timestamptz,
  -- When the paid-for time runs out: the next renewal (plus a short grace), or the end date once cancelled.
  add column if not exists paid_through             timestamptz;

-- Renewal payments sit next to the first order, so revenue includes them. Only the
-- first order decides whether the listing is paid for (refunding it cancels the listing).
alter table public.orders
  add column if not exists kind text not null default 'initial' check (kind in ('initial', 'renewal'));

grant select (subscription_status, subscription_renews_at, subscription_ends_at, paid_through)
  on public.submissions to authenticated;
