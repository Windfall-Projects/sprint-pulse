GRANT ALL PRIVILEGES ON public.profiles TO service_role;
GRANT ALL PRIVILEGES ON public.teams TO service_role;
GRANT ALL PRIVILEGES ON public.team_members TO service_role;
GRANT ALL PRIVILEGES ON public.work_items TO service_role;
GRANT ALL PRIVILEGES ON public.accounts TO authenticated, service_role;
GRANT ALL PRIVILEGES ON public.account_members TO authenticated, service_role;
