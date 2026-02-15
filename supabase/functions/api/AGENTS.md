On 2026-02-14 we discovered that we need to use Deno v2.1.4 to get the
supabase-edge-runtime-1.70.0 to work because v2.3+ of Deno generates a v5 lock
file which is not supported by the supabase-edge-runtime-1.70.0. Deno v2.1.4
generates a v4 lock file which is supported.
