#!/bin/bash
export PATH="/home/jules/.deno/bin:$PATH"

cat << 'MIG' > supabase/migrations/20260419130000_fix_virtual_profile_auth.sql
-- Fix virtual profile creation and RLS
-- 1. Grant service_role bypass RLS or direct permissions so it can insert profiles.
-- service_role should bypass RLS by default, but maybe there's a permission issue?
-- The error was: permission denied for table profiles. Grant privileges to service_role:
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;

-- The API failing with 401 is likely because the edge function uses
-- supabase.auth.getUser() to verify the token, but we are passing a service role token.
-- A service role token doesn't represent a specific user in auth.users,
-- so getUser() fails with 401 Unauthorized.
-- We must modify the edge functions to allow service_role or
-- we must login as a user and use the user's token.
MIG

echo "Done"
