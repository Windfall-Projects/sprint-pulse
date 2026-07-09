-- Fix the Manage virtual profiles RLS policy to allow inserts correctly.
-- The previous policy used 'for all' without a 'with check' clause,
-- causing permission denied on insert.
-- We must restrict it to authenticated users as intended.

drop policy if exists "Manage virtual profiles" on public.profiles;

create policy "Manage virtual profiles" on public.profiles for all using (
  auth.role() = 'authenticated'
)
with check (
  auth.role() = 'authenticated'
);
