-- Fix kudos RLS policy which compares profile_id to auth.uid()

drop policy "Manage kudos" on public.kudos;

create policy "Manage kudos" on public.kudos for all to authenticated
using (
  public.is_team_member(team_id)
  and sender_profile_id = public.current_profile_id()
)
with check (
  public.is_team_member(team_id)
  and sender_profile_id = public.current_profile_id()
);
