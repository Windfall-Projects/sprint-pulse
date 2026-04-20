-- ============================================================================
-- Migration: Add Manage Policies for team_members
-- Description:
--   The init migration only created a SELECT policy on `team_members`.
--   This adds INSERT and DELETE policies so that account members can:
--   1. Add any profile (real or virtual) to a team they belong to (INSERT).
--   2. Remove profiles from teams they belong to (DELETE).
--
--   The permission model aligns with the unified tenant isolation approach:
--   any authenticated account member can manage team membership within
--   that account. The profile being added does NOT need to be an
--   account_member (this is by design for Virtual Profiles).
-- ============================================================================

-- INSERT: An account member can add any profile to any team in their account.
create policy "Manage team members (insert)" on public.team_members
for insert to authenticated
with check (
  exists (
    select 1 from public.teams t
    where t.id = team_members.team_id
      and public.is_account_member(t.account_id)
  )
);

-- DELETE: An account member can remove profiles from any team in their account.
create policy "Manage team members (delete)" on public.team_members
for delete to authenticated
using (
  exists (
    select 1 from public.teams t
    where t.id = team_members.team_id
      and public.is_account_member(t.account_id)
  )
);

-- UPDATE: An account member can update role/title for any team member in their account.
create policy "Manage team members (update)" on public.team_members
for update to authenticated
using (
  exists (
    select 1 from public.teams t
    where t.id = team_members.team_id
      and public.is_account_member(t.account_id)
  )
)
with check (
  exists (
    select 1 from public.teams t
    where t.id = team_members.team_id
      and public.is_account_member(t.account_id)
  )
);
