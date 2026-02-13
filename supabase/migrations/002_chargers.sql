-- ============================================================
-- 002: Charger listings
-- ============================================================

create type public.connector_type as enum ('J1772', 'Tesla NACS', 'CCS');
create type public.charging_level as enum ('Level 1', 'Level 2', 'Level 3');
create type public.last_mile_pricing as enum ('free', 'flat', 'per_mile', 'per_minute');

create table public.chargers (
  id                uuid primary key default gen_random_uuid(),
  host_id           uuid not null references public.profiles(id) on delete cascade,

  -- Charger specs
  brand             text not null,
  model             text not null,
  connector_type    public.connector_type not null,
  level             public.charging_level not null,
  power_kw          numeric(6,2) not null,
  description       text,

  -- Location (address hidden until booking confirmed)
  address           text not null,
  city              text not null,
  lat               numeric(10,7),
  lng               numeric(10,7),

  -- Pricing
  price_per_kwh     numeric(6,4) not null,          -- e.g. 0.2000
  access_fee        numeric(6,2) not null default 0, -- flat fee per session

  -- Amenities & extras stored as JSONB arrays
  amenities         jsonb not null default '[]'::jsonb,   -- ["WiFi","Covered Parking"]
  extras            jsonb not null default '[]'::jsonb,   -- ["indoor","locked","washing*"]

  -- Last-mile ride service
  last_mile_enabled       boolean not null default false,
  last_mile_pricing_type  public.last_mile_pricing,
  last_mile_price         numeric(8,2),               -- flat dollar amount, $/mile, or $/min
  last_mile_two_way       boolean not null default false,
  last_mile_notes         text,

  -- Status
  available         boolean not null default true,
  next_slot         text,                             -- e.g. "3:00 PM Today" when unavailable
  active            boolean not null default true,     -- soft delete / unpublish

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger chargers_updated_at
  before update on public.chargers
  for each row execute function public.set_updated_at();

-- Availability windows: which days/hours the charger is available
create table public.charger_availability (
  id          uuid primary key default gen_random_uuid(),
  charger_id  uuid not null references public.chargers(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6), -- 0=Sun..6=Sat
  start_hour  smallint not null check (start_hour between 0 and 23),
  end_hour    smallint not null check (end_hour between 0 and 23),
  constraint unique_charger_day unique (charger_id, day_of_week)
);

-- Indexes
create index idx_chargers_host on public.chargers(host_id);
create index idx_chargers_city on public.chargers(city);
create index idx_chargers_connector on public.chargers(connector_type);
create index idx_chargers_level on public.chargers(level);
create index idx_chargers_active on public.chargers(active);
create index idx_chargers_last_mile on public.chargers(last_mile_enabled) where last_mile_enabled = true;
create index idx_avail_charger on public.charger_availability(charger_id);
