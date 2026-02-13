-- ============================================================
-- 006: Plans, Subscriptions, and Feature Gates
-- ============================================================

-- Plans
create type public.plan_audience as enum ('all', 'driver', 'homeowner');

create table public.plans (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,                -- "Free", "Driver Pro", "Homeowner Pro"
  slug                text not null unique,          -- "free", "driver_pro", "homeowner_pro"
  audience            public.plan_audience not null default 'all',
  price_cents         int not null default 0,        -- 0 = free, 900 = $9
  interval            text not null default 'month', -- 'month', 'year'
  stripe_price_id     text,                          -- Stripe Price ID
  description         text,
  active              boolean not null default true,
  created_at          timestamptz not null default now()
);

-- Seed the three plans
insert into plans (name, slug, audience, price_cents, interval, description) values
  ('Free',           'free',           'all',        0,   'month', 'Basic access for all users — auto-applied on sign up.'),
  ('Driver Pro',     'driver_pro',     'driver',     900, 'month', 'Priority booking, no ads, WattClub discounts, and more.'),
  ('Homeowner Pro',  'homeowner_pro',  'homeowner',  900, 'month', 'Advanced analytics, featured listings, no ads, and more.');

-- User subscriptions
create type public.subscription_status as enum ('active', 'past_due', 'cancelled', 'trialing');

create table public.subscriptions (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null references public.profiles(id) on delete cascade,
  plan_id                   uuid not null references public.plans(id),
  status                    public.subscription_status not null default 'active',
  stripe_subscription_id    text,
  stripe_customer_id        text,
  current_period_start      timestamptz,
  current_period_end        timestamptz,
  cancel_at_period_end      boolean not null default false,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- Auto-assign free plan on profile creation
create or replace function public.assign_free_plan()
returns trigger as $$
declare
  free_plan_id uuid;
begin
  select id into free_plan_id from public.plans where slug = 'free' limit 1;
  if free_plan_id is not null then
    insert into public.subscriptions (user_id, plan_id, status)
    values (new.id, free_plan_id, 'active');
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created_assign_plan
  after insert on public.profiles
  for each row execute function public.assign_free_plan();

-- ============================================================
-- Feature Gates
-- ============================================================

create table public.feature_gates (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,             -- e.g. 'no_ads', 'priority_booking'
  name        text not null,                    -- human-readable
  description text,
  created_at  timestamptz not null default now()
);

-- Seed features
insert into feature_gates (key, name, description) values
  ('no_ads',               'No Ads',                  'Remove all banner ads and promotional content'),
  ('priority_booking',     'Priority Booking',        'Book chargers before free-tier users'),
  ('wattclub_discount',    'WattClub Discount',       'Automatic 15% discount on all charging sessions'),
  ('last_mile_access',     'Last-Mile Service',       'Access to homeowner ride-to-destination service'),
  ('advanced_analytics',   'Advanced Analytics',       'Detailed earnings, usage, and trend dashboards'),
  ('featured_listing',     'Featured Listing',         'Charger appears with highlight badge in search results'),
  ('extended_availability','Extended Availability',    'Set availability windows beyond default limits'),
  ('club_admin',           'Club Admin Tools',         'Advanced club management and member analytics'),
  ('premium_support',      'Premium Support',          'Priority email and chat support'),
  ('custom_branding',      'Custom Branding',          'Customize your host profile with brand colors and logo');

-- Which features belong to which plans
create table public.plan_features (
  id          uuid primary key default gen_random_uuid(),
  plan_id     uuid not null references public.plans(id) on delete cascade,
  feature_id  uuid not null references public.feature_gates(id) on delete cascade,
  constraint unique_plan_feature unique (plan_id, feature_id)
);

-- Seed plan→feature mappings
-- Free plan: no gated features
-- Driver Pro: no_ads, priority_booking, wattclub_discount, last_mile_access, premium_support
-- Homeowner Pro: no_ads, advanced_analytics, featured_listing, extended_availability, club_admin, premium_support, custom_branding

insert into plan_features (plan_id, feature_id)
select p.id, f.id
from plans p
cross join feature_gates f
where (p.slug = 'driver_pro'    and f.key in ('no_ads','priority_booking','wattclub_discount','last_mile_access','premium_support'))
   or (p.slug = 'homeowner_pro' and f.key in ('no_ads','advanced_analytics','featured_listing','extended_availability','club_admin','premium_support','custom_branding'));

-- Per-user feature overrides (admin can grant/revoke individual features)
create table public.user_feature_overrides (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  feature_id  uuid not null references public.feature_gates(id) on delete cascade,
  enabled     boolean not null default true,   -- true = grant, false = explicitly revoke
  reason      text,
  granted_by  uuid references public.profiles(id),
  created_at  timestamptz not null default now(),
  constraint unique_user_feature unique (user_id, feature_id)
);

-- Indexes
create index idx_subscriptions_user on public.subscriptions(user_id);
create index idx_subscriptions_plan on public.subscriptions(plan_id);
create index idx_subscriptions_status on public.subscriptions(status);
create index idx_plan_features_plan on public.plan_features(plan_id);
create index idx_plan_features_feature on public.plan_features(feature_id);
create index idx_user_overrides_user on public.user_feature_overrides(user_id);

-- ============================================================
-- Helper function: check if user has feature
-- ============================================================
create or replace function public.user_has_feature(p_user_id uuid, p_feature_key text)
returns boolean as $$
declare
  has_override boolean;
  override_enabled boolean;
  has_via_plan boolean;
begin
  -- Check explicit override first
  select enabled into override_enabled
  from public.user_feature_overrides ufo
  join public.feature_gates fg on fg.id = ufo.feature_id
  where ufo.user_id = p_user_id and fg.key = p_feature_key
  limit 1;

  if found then
    return override_enabled;
  end if;

  -- Check via active subscription → plan → features
  select exists(
    select 1
    from public.subscriptions s
    join public.plan_features pf on pf.plan_id = s.plan_id
    join public.feature_gates fg on fg.id = pf.feature_id
    where s.user_id = p_user_id
      and s.status = 'active'
      and fg.key = p_feature_key
  ) into has_via_plan;

  return has_via_plan;
end;
$$ language plpgsql security definer stable;
