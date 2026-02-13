-- ============================================================
-- 007: Row Level Security policies
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.chargers enable row level security;
alter table public.charger_availability enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.charge_clubs enable row level security;
alter table public.club_memberships enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.feature_gates enable row level security;
alter table public.plan_features enable row level security;
alter table public.user_feature_overrides enable row level security;

-- ─── Profiles ───
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- ─── Chargers ───
create policy "Active chargers are viewable by everyone"
  on public.chargers for select using (active = true);

create policy "Hosts can insert own chargers"
  on public.chargers for insert with check (auth.uid() = host_id);

create policy "Hosts can update own chargers"
  on public.chargers for update using (auth.uid() = host_id);

create policy "Hosts can delete own chargers"
  on public.chargers for delete using (auth.uid() = host_id);

-- ─── Charger Availability ───
create policy "Availability viewable by everyone"
  on public.charger_availability for select using (true);

create policy "Hosts can manage availability for own chargers"
  on public.charger_availability for insert
  with check (
    exists (select 1 from public.chargers where id = charger_id and host_id = auth.uid())
  );

create policy "Hosts can update own charger availability"
  on public.charger_availability for update
  using (
    exists (select 1 from public.chargers where id = charger_id and host_id = auth.uid())
  );

create policy "Hosts can delete own charger availability"
  on public.charger_availability for delete
  using (
    exists (select 1 from public.chargers where id = charger_id and host_id = auth.uid())
  );

-- ─── Bookings ───
create policy "Users can view own bookings (driver or host)"
  on public.bookings for select
  using (auth.uid() = driver_id or auth.uid() = host_id);

create policy "Authenticated users can create bookings"
  on public.bookings for insert
  with check (auth.uid() = driver_id);

create policy "Participants can update booking status"
  on public.bookings for update
  using (auth.uid() = driver_id or auth.uid() = host_id);

-- ─── Reviews ───
create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Authors can insert reviews"
  on public.reviews for insert with check (auth.uid() = author_id);

-- ─── Charge Clubs ───
create policy "Clubs are viewable by everyone"
  on public.charge_clubs for select using (true);

create policy "Authenticated users can create clubs"
  on public.charge_clubs for insert with check (auth.uid() = founded_by);

create policy "Founders can update clubs"
  on public.charge_clubs for update using (auth.uid() = founded_by);

-- ─── Club Memberships ───
create policy "Members can view own memberships"
  on public.club_memberships for select
  using (auth.uid() = user_id);

create policy "Club admins can view all memberships for their clubs"
  on public.club_memberships for select
  using (
    exists (
      select 1 from public.club_memberships cm
      where cm.club_id = club_memberships.club_id
        and cm.user_id = auth.uid()
        and cm.role in ('founder', 'admin')
    )
  );

create policy "Users can request membership"
  on public.club_memberships for insert
  with check (auth.uid() = user_id);

create policy "Club admins can update membership status"
  on public.club_memberships for update
  using (
    exists (
      select 1 from public.club_memberships cm
      where cm.club_id = club_memberships.club_id
        and cm.user_id = auth.uid()
        and cm.role in ('founder', 'admin')
    )
  );

-- ─── Plans (read-only for everyone) ───
create policy "Plans viewable by everyone"
  on public.plans for select using (true);

-- ─── Subscriptions ───
create policy "Users can view own subscriptions"
  on public.subscriptions for select using (auth.uid() = user_id);

-- ─── Feature Gates (read-only for everyone) ───
create policy "Feature gates viewable by everyone"
  on public.feature_gates for select using (true);

-- ─── Plan Features (read-only for everyone) ───
create policy "Plan features viewable by everyone"
  on public.plan_features for select using (true);

-- ─── User Feature Overrides ───
create policy "Users can view own overrides"
  on public.user_feature_overrides for select using (auth.uid() = user_id);
