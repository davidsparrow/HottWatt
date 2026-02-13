-- ============================================================
-- 003: Bookings
-- ============================================================

create type public.booking_status as enum (
  'pending',       -- just created
  'confirmed',     -- payment authorized
  'active',        -- charger activated, session in progress
  'completed',     -- session ended, payment captured
  'cancelled'      -- cancelled by either party
);

create table public.bookings (
  id                uuid primary key default gen_random_uuid(),
  charger_id        uuid not null references public.chargers(id) on delete cascade,
  driver_id         uuid not null references public.profiles(id) on delete cascade,
  host_id           uuid not null references public.profiles(id) on delete cascade,

  -- Schedule
  booking_date      date not null,
  start_hour        smallint not null,
  end_hour          smallint not null,

  -- Pricing snapshot (captured at booking time)
  price_per_kwh     numeric(6,4) not null,
  power_kw          numeric(6,2) not null,
  access_fee        numeric(6,2) not null,
  duration_hours    numeric(4,1) not null,
  energy_cost       numeric(8,2) not null,   -- price_per_kwh * power_kw * duration
  discount_amount   numeric(8,2) not null default 0,
  total_cost        numeric(8,2) not null,

  -- Last-mile
  last_mile_requested  boolean not null default false,
  last_mile_cost       numeric(8,2),

  -- WattClub
  wattclub_applied  boolean not null default false,

  -- Status
  status            public.booking_status not null default 'pending',
  charger_activated boolean not null default false,
  activated_at      timestamptz,
  completed_at      timestamptz,

  -- Stripe
  stripe_payment_intent_id text,

  -- Contact info (guest bookings for demo compat)
  guest_name        text,
  guest_email       text,
  guest_phone       text,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- Indexes
create index idx_bookings_charger on public.bookings(charger_id);
create index idx_bookings_driver on public.bookings(driver_id);
create index idx_bookings_host on public.bookings(host_id);
create index idx_bookings_status on public.bookings(status);
create index idx_bookings_date on public.bookings(booking_date);
