-- ============================================================================
-- Sprint Pulse: Integrations
-- Description: Core tables for mapping external tools (GitHub) to Sprint Pulse.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Integrations
-- ----------------------------------------------------------------------------
create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  provider text not null check (provider in ('github')),
  installation_id text, -- Used for the GitHub App installation context
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(account_id, provider)
);

create trigger handle_updated_at before update on public.integrations
  for each row execute procedure public.set_updated_at();

alter table public.integrations enable row level security;
create policy "Tenant Isolation: Integrations" on public.integrations
for all
using ( public.is_account_member(account_id) )
with check ( public.is_account_member(account_id) );


-- ----------------------------------------------------------------------------
-- 2. Integration Mappings
-- ----------------------------------------------------------------------------
create table public.integration_mappings (
  id uuid primary key default gen_random_uuid(),
  integration_id uuid not null references public.integrations(id) on delete cascade,
  external_repo_id text not null, -- Stores the "owner/repo" string
  team_id uuid not null references public.teams(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(integration_id, external_repo_id)
);

create trigger handle_updated_at before update on public.integration_mappings
  for each row execute procedure public.set_updated_at();

alter table public.integration_mappings enable row level security;
create policy "Tenant Isolation: Integration Mappings" on public.integration_mappings
for all
using (
  exists (
    select 1 from public.integrations i 
    where i.id = integration_mappings.integration_id 
    and public.is_account_member(i.account_id)
  )
)
with check (
  exists (
    select 1 from public.integrations i 
    where i.id = integration_mappings.integration_id 
    and public.is_account_member(i.account_id)
  )
);
