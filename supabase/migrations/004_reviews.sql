-- ============================================================
-- 004: Two-way reviews
-- ============================================================

create type public.review_direction as enum (
  'driver_to_host',   -- driver reviews the host/charger
  'host_to_driver'    -- host reviews the driver
);

create table public.reviews (
  id            uuid primary key default gen_random_uuid(),
  booking_id    uuid not null references public.bookings(id) on delete cascade,
  author_id     uuid not null references public.profiles(id) on delete cascade,
  subject_id    uuid not null references public.profiles(id) on delete cascade,
  charger_id    uuid not null references public.chargers(id) on delete cascade,
  direction     public.review_direction not null,
  rating        smallint not null check (rating between 1 and 5),
  comment       text,
  created_at    timestamptz not null default now(),

  -- One review per direction per booking
  constraint unique_review_per_booking unique (booking_id, direction)
);

-- Indexes
create index idx_reviews_charger on public.reviews(charger_id);
create index idx_reviews_author on public.reviews(author_id);
create index idx_reviews_subject on public.reviews(subject_id);
create index idx_reviews_direction on public.reviews(direction);

-- Materialized view: per-profile average ratings (refreshed periodically)
create materialized view public.profile_ratings as
  select
    subject_id,
    direction,
    count(*)::int as review_count,
    round(avg(rating), 2) as avg_rating
  from public.reviews
  group by subject_id, direction;

create unique index idx_profile_ratings on public.profile_ratings(subject_id, direction);
