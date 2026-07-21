-- Fix virtual profile creation and RLS
-- Grant privileges to service_role so it can insert/manage profiles directly.
GRANT ALL PRIVILEGES ON public.profiles TO service_role;
