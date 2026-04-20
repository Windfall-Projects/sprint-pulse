-- Fix missing RLS policies using public.is_team_member()

-- Allow team members to manage projects
create policy "Manage projects" on public.projects for all to authenticated
using ( public.is_team_member(team_id) )
with check ( public.is_team_member(team_id) );

-- Allow team members to manage sprint_commitments
create policy "Manage commitments" on public.sprint_commitments for all to authenticated
using (
  exists (select 1 from public.sprints s where s.id = sprint_commitments.sprint_id and public.is_team_member(s.team_id))
)
with check (
  exists (select 1 from public.sprints s where s.id = sprint_commitments.sprint_id and public.is_team_member(s.team_id))
);

-- Allow team members to manage sprint_snapshots
create policy "Manage snapshots" on public.sprint_snapshots for all to authenticated
using (
  exists (select 1 from public.sprints s where s.id = sprint_snapshots.sprint_id and public.is_team_member(s.team_id))
)
with check (
  exists (select 1 from public.sprints s where s.id = sprint_snapshots.sprint_id and public.is_team_member(s.team_id))
);

-- Allow team members to manage historical_metrics
create policy "Manage historical metrics" on public.historical_metrics for all to authenticated
using ( public.is_team_member(team_id) )
with check ( public.is_team_member(team_id) );
