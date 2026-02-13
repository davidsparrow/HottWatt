-- ============================================================
-- 001: Profiles (extends auth.users)
-- ============================================================

-- User types: 'driver', 'homeowner', or 'both'
create type public.user_role as enum ('driver', 'homeowner', 'both');

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  full_name     text,
  phone         text,
  avatar_url    text,
  role          public.user_role not null default 'driver',
  verified      boolean not null default false,
  bio           text,
  city          text,
  stripe_customer_id  text,                -- Stripe customer ID
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated-at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Indexes
create index idx_profiles_role on public.profiles(role);
create index idx_profiles_city on public.profiles(city);
create index idx_profiles_stripe on public.profiles(stripe_customer_id);
