-- Saver Option: listing subscriptions can be paid through Dodo Payments as well as
-- Lemon Squeezy. New checkouts go to Dodo once it's configured; subscriptions started
-- with Lemon Squeezy keep renewing there. Payment state still changes only from
-- verified webhooks.

alter table public.submissions
  -- Which provider the submission's checkout and subscription belong to.
  add column if not exists billing_provider text not null default 'lemonsqueezy'
    check (billing_provider in ('lemonsqueezy', 'dodo')),
  -- Dodo's customer id, for the customer portal link ("Manage subscription").
  add column if not exists provider_customer_id text;

alter table public.orders drop constraint if exists orders_provider_check;
alter table public.orders add constraint orders_provider_check check (provider in ('lemonsqueezy', 'dodo'));

grant select (billing_provider) on public.submissions to authenticated;
