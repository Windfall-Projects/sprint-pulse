-- Redefine is_team_member to map directly to Tenant Isolation for the MVP.
-- This ensures features like Surveys, Pulse, and Kudos inherit the same 
-- simplified permission model (users can access elements across all teams 
-- in their account).

create or replace function public.is_team_member(p_team_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.teams t
    where t.id = p_team_id and public.is_account_member(t.account_id)
  );
$$;

-- Additionally, update the Manage Surveys policy for surveys to not require strict 'lead' role
drop policy if exists "Manage surveys" on public.surveys;
create policy "Manage surveys" on public.surveys for all to authenticated
using (
  public.is_team_member(team_id)
);

drop policy if exists "Manage questions" on public.survey_questions;
create policy "Manage questions" on public.survey_questions for all to authenticated
using (
  exists (select 1 from public.surveys s where s.id = survey_questions.survey_id and public.is_team_member(s.team_id))
);
