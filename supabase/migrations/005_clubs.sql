-- ============================================================
-- 005: Charge Clubs
-- ============================================================

create type public.membership_status as enum ('pending', 'approved', 'rejected');

create table public.charge_clubs (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  neighborhood        text not null,
  city                text not null,
  description         text,
  founded_by          uuid references public.profiles(id) on delete set null,
  accepting_members   boolean not null default true,

  -- Stats (updated via triggers or periodic job)
  total_members       int not null default 0,
  total_capacity_kw   numeric(10,2) not null default 0,
  total_watts_received text,                          -- display string e.g. "1.2M"

  -- Map position (percentage coordinates for the Bay Area map overlay)
  map_x               numeric(5,2),
  map_y               numeric(5,2),

  -- Apartment partnership support
  apartment_partner   boolean not null default false,
  apartment_name      text,                           -- e.g. "Parkside Apartments"

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger clubs_updated_at
  before update on public.charge_clubs
  for each row execute function public.set_updated_at();

create table public.club_memberships (
  id          uuid primary key default gen_random_uuid(),
  club_id     uuid not null references public.charge_clubs(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  status      public.membership_status not null default 'pending',
  role        text not null default 'member',  -- 'founder', 'admin', 'member'
  created_at  timestamptz not null default now(),
  constraint unique_club_member unique (club_id, user_id)
);

-- Update member count on membership changes
create or replace function public.update_club_member_count()
returns trigger as $$
begin
  update public.charge_clubs
  set total_members = (
    select count(*) from public.club_memberships
    where club_id = coalesce(new.club_id, old.club_id)
      and status = 'approved'
  )
  where id = coalesce(new.club_id, old.club_id);
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

create trigger on_membership_change
  after insert or update or delete on public.club_memberships
  for each row execute function public.update_club_member_count();

-- Indexes
create index idx_clubs_city on public.charge_clubs(city);
create index idx_clubs_accepting on public.charge_clubs(accepting_members);
create index idx_memberships_club on public.club_memberships(club_id);
create index idx_memberships_user on public.club_memberships(user_id);
