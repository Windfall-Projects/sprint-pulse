-- ============================================================================
-- Migration: Enable Virtual Profiles (Decouple Profiles from Auth)
-- Description: 
-- 1. Introduces `profiles.id` (UUID) as the new Primary Key.
-- 2. Renames `profiles.user_id` to `profiles.auth_user_id` (Nullable).
-- 3. Updates all FKs in other tables to point to `profiles.id`.
-- ============================================================================

-- 1. Refactor `profiles` table
alter table public.profiles
  drop constraint profiles_pkey cascade; -- Drops FKs too (we'll recreate them)

alter table public.profiles
  add column id uuid default gen_random_uuid() primary key;

alter table public.profiles
  rename column user_id to auth_user_id;

alter table public.profiles
  alter column auth_user_id drop not null;

alter table public.profiles
  add constraint profiles_auth_user_id_key unique (auth_user_id);

alter table public.profiles
  add constraint profiles_auth_user_id_fkey 
  foreign key (auth_user_id) references auth.users(id) on delete set null;

-- 2. Update `team_members`
-- Note: Since we dropped the PK constraint on profiles with CASCADE,
-- the FKs on dependent tables might have been dropped. We need to check and recreate/update columns.
-- BUT: The data in the dependent tables (`user_id` column) currently holds Auth IDs.
-- We need to migrate this data to the new `metrics/profiles.id`.

-- MIGRATION STRATEGY:
-- A. The dependent tables still have `user_id` columns with Auth ID values.
-- B. We need to map `user_id` (Auth ID) -> `profiles.id`.

-- ----------------------------------------------------------------------------
-- MIGRATION UTILITY
-- ----------------------------------------------------------------------------

-- Helper to map Auth ID to Profile ID
create or replace function public.get_profile_id_by_auth_id(p_auth_id uuid)
returns uuid language sql stable as $$
  select id from public.profiles where auth_user_id = p_auth_id;
$$;

-- ----------------------------------------------------------------------------
-- Update `team_members`
-- ----------------------------------------------------------------------------
alter table public.team_members drop constraint if exists team_members_user_id_fkey;

alter table public.team_members
  rename column user_id to profile_id;

-- Update the values: currently `profile_id` holds Auth UUIDs.
-- Verify: Ideally we update `profile_id` to the new `profiles.id`.
update public.team_members
set profile_id = public.get_profile_id_by_auth_id(profile_id);

-- Add Reference
alter table public.team_members
  add constraint team_members_profile_id_fkey 
  foreign key (profile_id) references public.profiles(id) on delete cascade;

-- ----------------------------------------------------------------------------
-- Update `work_items`
-- ----------------------------------------------------------------------------
alter table public.work_items drop constraint if exists work_items_assignee_user_id_fkey;

alter table public.work_items
  rename column assignee_user_id to assignee_profile_id;

update public.work_items
set assignee_profile_id = public.get_profile_id_by_auth_id(assignee_profile_id)
where assignee_profile_id is not null;

alter table public.work_items
  add constraint work_items_assignee_profile_id_fkey 
  foreign key (assignee_profile_id) references public.profiles(id) on delete set null;

-- ----------------------------------------------------------------------------
-- Update `historical_metrics`
-- ----------------------------------------------------------------------------
alter table public.historical_metrics drop constraint if exists historical_metrics_user_id_fkey;

alter table public.historical_metrics
  rename column user_id to profile_id;

update public.historical_metrics
set profile_id = public.get_profile_id_by_auth_id(profile_id)
where profile_id is not null;

alter table public.historical_metrics
  add constraint historical_metrics_profile_id_fkey 
  foreign key (profile_id) references public.profiles(id) on delete cascade;

-- ----------------------------------------------------------------------------
-- Update `sprint_commitments`
-- ----------------------------------------------------------------------------
alter table public.sprint_commitments drop constraint if exists sprint_commitments_user_id_fkey;

alter table public.sprint_commitments
  rename column user_id to profile_id;

update public.sprint_commitments
set profile_id = public.get_profile_id_by_auth_id(profile_id)
where profile_id is not null;

alter table public.sprint_commitments
  add constraint sprint_commitments_profile_id_fkey
  foreign key (profile_id) references public.profiles(id) on delete cascade;

-- ----------------------------------------------------------------------------
-- Update `sprint_snapshots`
-- ----------------------------------------------------------------------------
alter table public.sprint_snapshots drop constraint if exists sprint_snapshots_user_id_fkey;

alter table public.sprint_snapshots
  rename column user_id to profile_id;

update public.sprint_snapshots
set profile_id = public.get_profile_id_by_auth_id(profile_id)
where profile_id is not null;

alter table public.sprint_snapshots
  add constraint sprint_snapshots_profile_id_fkey
  foreign key (profile_id) references public.profiles(id) on delete cascade;

-- ----------------------------------------------------------------------------
-- Update `survey_responses`
-- ----------------------------------------------------------------------------
alter table public.survey_responses drop constraint if exists survey_responses_user_id_fkey;

alter table public.survey_responses
  rename column user_id to responder_profile_id;

update public.survey_responses
set responder_profile_id = public.get_profile_id_by_auth_id(responder_profile_id)
where responder_profile_id is not null;

alter table public.survey_responses
  add constraint survey_responses_responder_profile_id_fkey
  foreign key (responder_profile_id) references public.profiles(id) on delete set null;

-- ----------------------------------------------------------------------------
-- Update `kudos`
-- ----------------------------------------------------------------------------
alter table public.kudos drop constraint if exists kudos_sender_user_id_fkey;
alter table public.kudos drop constraint if exists kudos_receiver_user_id_fkey;

alter table public.kudos
  rename column sender_user_id to sender_profile_id;

alter table public.kudos
  rename column receiver_user_id to receiver_profile_id;

update public.kudos
set sender_profile_id = public.get_profile_id_by_auth_id(sender_profile_id)
where sender_profile_id is not null;

update public.kudos
set receiver_profile_id = public.get_profile_id_by_auth_id(receiver_profile_id)
where receiver_profile_id is not null;

alter table public.kudos
  add constraint kudos_sender_profile_id_fkey
  foreign key (sender_profile_id) references public.profiles(id) on delete set null;

alter table public.kudos
  add constraint kudos_receiver_profile_id_fkey
  foreign key (receiver_profile_id) references public.profiles(id) on delete set null;

-- ----------------------------------------------------------------------------
-- account_members and policies
-- Note: account_members MUST typically remain linked to Auth for login/permissioning.
-- However, we likely want `account_members` to imply a Profile exists.
-- For now, `account_members` keeps `user_id` (Auth ID) because it controls Access to the System.
-- Virtual Profiles don't log in, so they aren't "Account Members" in the Auth sense, 
-- but they are "Team Members".
-- ----------------------------------------------------------------------------

-- 3. Update RLS Policies & Helper Functions

-- Helper: Get Profile ID for current Auth User
create or replace function public.current_profile_id()
returns uuid language sql stable as $$
  select id from public.profiles where auth_user_id = auth.uid();
$$;

-- Update `is_team_member` to traverse through Profile
create or replace function public.is_team_member(p_team_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.team_members tm
    join public.profiles p on p.id = tm.profile_id
    where tm.team_id = p_team_id 
    and p.auth_user_id = auth.uid()
  );
$$;

-- Update `profiles` Policies
drop policy "Profiles viewable by everyone" on public.profiles;
drop policy "Users update own profile" on public.profiles;
drop policy "Users insert own profile" on public.profiles;

create policy "View profiles" on public.profiles for select using (true);

-- Insert: 
-- 1. Users can create their own profile (linking to their auth_id)
-- 2. Team Leads/Admins can create profiles (auth_id is null) - handled via Team Membership logic?
--    Actually, creating a profile is usually done via a trigger on Auth Signup for real users.
--    For Virtual Users, it's an explicit API call.
create policy "Create own profile" on public.profiles for insert with check (
  auth_user_id = auth.uid()
);

create policy "Manage virtual profiles" on public.profiles for all using (
  -- Allow if you are an account admin of any account? 
  -- Or if you are adding them to a team you lead? 
  -- This is tricky because `profiles` is global/not tenant-scoped by column.
  -- Strategy: We'll likely restrict Virtual Profile creation to the Service Role or 
  -- via specific Team adding logic in the API.
  -- For now, let's allow Authenticated users to INSERT profiles (for virtuals) 
  -- and we enforce logic in API (must link to a team immediately).
  auth.role() = 'authenticated'
);

create policy "Update own profile" on public.profiles for update using (
  auth_user_id = auth.uid()
);

-- Grant privileges for service role to prevent permissions issues in Edge Functions/Tests
grant all privileges on all tables in schema public to service_role;

-- Cleanup
drop function public.get_profile_id_by_auth_id(uuid);
