-- Update policies to use Tenant Isolation (is_account_member) instead of is_team_member
-- This matches the simplified permission model used throughout the app for MVP (e.g. Sprints, Work Items)
-- which allows any member of the Account to manage objects within the account.

-- Projects
drop policy if exists "Manage projects" on public.projects;
create policy "Tenant Isolation: Projects" on public.projects for all to authenticated
using (
  exists (select 1 from public.teams t where t.id = projects.team_id and public.is_account_member(t.account_id))
)
with check (
  exists (select 1 from public.teams t where t.id = projects.team_id and public.is_account_member(t.account_id))
);

-- Historical Metrics
drop policy if exists "Manage historical metrics" on public.historical_metrics;
create policy "Tenant Isolation: Historical Metrics" on public.historical_metrics for all to authenticated
using (
  exists (select 1 from public.teams t where t.id = historical_metrics.team_id and public.is_account_member(t.account_id))
)
with check (
  exists (select 1 from public.teams t where t.id = historical_metrics.team_id and public.is_account_member(t.account_id))
);

-- Sprint Commitments
drop policy if exists "Manage commitments" on public.sprint_commitments;
create policy "Tenant Isolation: Commitments" on public.sprint_commitments for all to authenticated
using (
  exists (select 1 from public.sprints s where s.id = sprint_commitments.sprint_id and public.is_account_member(s.account_id))
)
with check (
  exists (select 1 from public.sprints s where s.id = sprint_commitments.sprint_id and public.is_account_member(s.account_id))
);

-- Sprint Snapshots
drop policy if exists "Manage snapshots" on public.sprint_snapshots;
create policy "Tenant Isolation: Snapshots" on public.sprint_snapshots for all to authenticated
using (
  exists (select 1 from public.sprints s where s.id = sprint_snapshots.sprint_id and public.is_account_member(s.account_id))
)
with check (
  exists (select 1 from public.sprints s where s.id = sprint_snapshots.sprint_id and public.is_account_member(s.account_id))
);
