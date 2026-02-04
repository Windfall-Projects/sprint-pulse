-- ============================================================================
-- Sprint Pulse: MVP Schema (Production Ready)
-- Description: Core Accounts, Teams, Sprint logic, and Pulse Survey Engine
-- ============================================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Helper: Timestamp Trigger
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 2. Profiles
-- ----------------------------------------------------------------------------
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles viewable by everyone" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = user_id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = user_id);

create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 3. Accounts
-- ----------------------------------------------------------------------------
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  is_test_tenant boolean default false,
  owner_user_id uuid not null references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger handle_updated_at before update on public.accounts
  for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 4. Account Members
-- ----------------------------------------------------------------------------
create table public.account_members (
  account_id uuid references public.accounts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz default now(),
  primary key (account_id, user_id)
);

-- 1. SECURITY HELPER
create or replace function public.is_account_member(p_account_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.account_members am
    where am.account_id = p_account_id and am.user_id = auth.uid()
  );
$$;

-- 2. ACCOUNTS TABLE (Split policies for lifecycle management)
alter table public.accounts enable row level security;

-- A. SELECT: Users see accounts they belong to
create policy "View own accounts" on public.accounts
for select using (public.is_account_member(id));

-- B. INSERT: Authenticated users (Agents) can create new accounts
-- We don't check membership here because the row is brand new.
create policy "Create accounts" on public.accounts
for insert with check (auth.role() = 'authenticated');

-- C. UPDATE: The "Janitor Protection" Lock
-- Only members can update, AND they cannot remove the 'is_test_tenant' flag.
create policy "Update own accounts" on public.accounts
for update using (public.is_account_member(id))
with check (
  -- Allow setting flag to true, but prevent flipping it back to false
  (is_test_tenant = true) OR 
  (is_test_tenant is not distinct from (select is_test_tenant from public.accounts where id = id))
);

-- 3. ACCOUNT MEMBERS TABLE (Enable bootstrapping)
alter table public.account_members enable row level security;

-- A. SELECT: Members can view the team list
create policy "View account members" on public.account_members
for select using (public.is_account_member(account_id));

-- B. INSERT: The "Self-Join" Policy
-- Allows the Agent to link itself to the Account it just created.
create policy "Join accounts" on public.account_members
for insert with check (
  auth.uid() = user_id -- You can only add YOURSELF, not others.
);

-- ----------------------------------------------------------------------------
-- 5. Teams
-- ----------------------------------------------------------------------------
create table public.teams (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create trigger handle_updated_at before update on public.teams
  for each row execute procedure public.set_updated_at();

alter table public.teams enable row level security;

create policy "View teams in account" on public.teams for select to authenticated
using (public.is_account_member(account_id));

create policy "Create teams (Admin/Owner)" on public.teams for insert to authenticated
with check (
  exists (
    select 1 from public.account_members 
    where account_id = teams.account_id 
    and user_id = auth.uid() 
    and role in ('owner', 'admin')
  )
);

-- ----------------------------------------------------------------------------
-- 6. Team Members
-- ----------------------------------------------------------------------------
create table public.team_members (
  team_id uuid references public.teams(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'contributor' check (role in ('lead', 'contributor', 'stakeholder')),
  title text, 
  joined_at timestamptz default now(),
  primary key (team_id, user_id)
);

-- Helper for Team RLS
create or replace function public.is_team_member(p_team_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.team_members tm
    where tm.team_id = p_team_id and tm.user_id = auth.uid()
  );
$$;

alter table public.team_members enable row level security;

create policy "View team members" on public.team_members for select to authenticated
using (
  exists (
    select 1 from public.teams t
    where t.id = team_members.team_id and public.is_account_member(t.account_id)
  )
);

-- ----------------------------------------------------------------------------
-- 7. Sprints
-- ----------------------------------------------------------------------------
create table public.sprints (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete restrict,
  account_id uuid not null references public.accounts(id) on delete cascade,
  name text not null,
  goal text,
  start_date date not null,
  end_date date not null,
  status text not null default 'planned' check (status in ('planned', 'active', 'completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint valid_dates check (end_date >= start_date)
);

create trigger handle_updated_at before update on public.sprints
  for each row execute procedure public.set_updated_at();

alter table public.sprints enable row level security;

-- "Airtight" Policy:
-- 1. Tenant Isolation: Users can only see/touch sprints in their own Account.
-- 2. Simplified Permissions: Any member of the account can manage sprints 
--    (Ideal for your AI Agents/Test Runners).
create policy "Tenant Isolation: Sprints" on public.sprints
for all -- Covers SELECT, INSERT, UPDATE, DELETE
using ( public.is_account_member(account_id) )
with check ( public.is_account_member(account_id) );

-- ----------------------------------------------------------------------------
-- 8. Pulse Engine (Surveys & Responses)
-- ----------------------------------------------------------------------------

create table public.surveys (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  title text not null,
  description text,
  is_system_template boolean default false,
  account_id uuid not null references public.accounts(id) on delete cascade,
  -- Check constraint to match Zod
  trigger_event text check (trigger_event in ('daily', 'sprint_start', 'sprint_end', 'manual')),
  created_at timestamptz default now()
);

create table public.survey_questions (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid references public.surveys(id) on delete cascade,
  question_text text not null,

  -- The Bridge to the Standard Metrics
  -- Allows you to query "Give me all Flow scores" without knowing the exact question text.
  metric_category text check (metric_category in ('satisfaction', 'flow', 'friction', 'safety', 'workload', 'other')),

  -- Check constraint and options column
  response_type text not null check (response_type in ('scale_1_5', 'text', 'single_select', 'emoji_mood')),
  order_index int not null default 0,
  is_required boolean default true,
  options jsonb -- Needed for single_select
);

create table public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid references public.surveys(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  sprint_id uuid references public.sprints(id) on delete cascade,
  is_confidential boolean default false, 
  created_at timestamptz default now()
);

create table public.survey_answers (
  id uuid primary key default gen_random_uuid(),
  response_id uuid references public.survey_responses(id) on delete cascade,
  question_id uuid references public.survey_questions(id) on delete cascade,
  value_text text,
  value_number int, 
  value_json jsonb 
);

-- Pulse RLS
alter table public.surveys enable row level security;
alter table public.survey_questions enable row level security;
alter table public.survey_responses enable row level security;
alter table public.survey_answers enable row level security;

-- ==============================================================================
-- 1. SURVEYS
-- ==============================================================================

-- View: Team members see team surveys + System Templates
create policy "View surveys" on public.surveys for select to authenticated
using (
  (team_id is null and is_system_template = true) 
  or public.is_team_member(team_id)
);

-- Manage: Team Leads can create/edit/delete surveys for their team
create policy "Manage surveys" on public.surveys for all to authenticated
using (
  exists (
    select 1 from public.team_members tm
    where tm.team_id = surveys.team_id
    and tm.user_id = auth.uid()
    and tm.role = 'lead'
  )
);

-- ==============================================================================
-- 2. QUESTIONS
-- ==============================================================================

-- View: Inherit access from Survey (Any team member can view)
create policy "View questions" on public.survey_questions for select to authenticated
using (
  exists (select 1 from public.surveys s where s.id = survey_questions.survey_id)
);

-- Manage: Team Leads can manage questions (via Survey ownership)
create policy "Manage questions" on public.survey_questions for all to authenticated
using (
  exists (
    select 1 from public.surveys s
    join public.team_members tm on tm.team_id = s.team_id
    where s.id = survey_questions.survey_id
    and tm.user_id = auth.uid()
    and tm.role = 'lead'
  )
);

-- ==============================================================================
-- 3. RESPONSES
-- ==============================================================================

-- View: View your own OR if you are a Lead (view all)
create policy "View responses" on public.survey_responses for select to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1 from public.sprints s
    join public.team_members tm on tm.team_id = s.team_id
    where s.id = survey_responses.sprint_id
    and tm.user_id = auth.uid()
    and tm.role = 'lead'
  )
);

-- Insert: Team members can submit
create policy "Submit response" on public.survey_responses for insert to authenticated
with check (
  exists (
    select 1 from public.sprints s 
    where s.id = sprint_id and public.is_team_member(s.team_id)
  )
  and user_id = auth.uid() -- Enforce that you can only submit for yourself
);

-- Update: Users can edit their own response
-- Added check to prevent moving response to a forbidden sprint
create policy "Edit own response" on public.survey_responses for update to authenticated
using ( user_id = auth.uid() )
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.sprints s 
    where s.id = sprint_id 
    and public.is_team_member(s.team_id)
  )
);

-- Delete: Users can delete their own response
create policy "Delete own response" on public.survey_responses for delete to authenticated
using ( user_id = auth.uid() );

-- ==============================================================================
-- 4. ANSWERS
-- ==============================================================================

-- View: If you can see the response, you can see the answers
create policy "View answers" on public.survey_answers for select to authenticated
using (
  exists (select 1 from public.survey_responses r where r.id = survey_answers.response_id)
);

-- Insert/Update: You can only write answers to your own response
create policy "Manage answers" on public.survey_answers for all to authenticated
using (
  exists (
    select 1 from public.survey_responses r 
    where r.id = response_id 
    and r.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.survey_responses r 
    where r.id = response_id 
    and r.user_id = auth.uid()
  )
);

-- ----------------------------------------------------------------------------
-- 9. Recognition (Kudos)
-- ----------------------------------------------------------------------------

create table public.kudos (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  sender_user_id uuid references auth.users(id),
  receiver_user_id uuid references auth.users(id),
  sprint_id uuid references public.sprints(id),
  account_id uuid not null references public.accounts(id) on delete cascade,
  message text not null,
  -- Check constraint
  category text check (category in ('unblock', 'support', 'technical_win', 'team_spirit')),
  created_at timestamptz default now()
);

alter table public.kudos enable row level security;

--- Team members can see all kudos in their team
create policy "View kudos" on public.kudos for select to authenticated
using ( public.is_team_member(team_id) );

-- Users can Create (Insert) and Delete their OWN kudos
create policy "Manage kudos" on public.kudos for all to authenticated
using (
  -- For Delete/Update: Must be in team AND be the author
  public.is_team_member(team_id) 
  and sender_user_id = auth.uid()
)
with check (
  -- For Insert: Must be in team AND authoring as self
  public.is_team_member(team_id) 
  and sender_user_id = auth.uid()
);

-- ----------------------------------------------------------------------------
-- Projects (Scope of Work)
-- Allows tracking initiatives that span multiple sprints
-- ----------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade not null,
  
  name text not null,
  description text,
  status text default 'active' check (status in ('active', 'archived', 'completed')),
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;
create policy "View projects" on public.projects for select using (
  exists (select 1 from public.team_members tm where tm.team_id = projects.team_id and tm.user_id = auth.uid())
);

-- ----------------------------------------------------------------------------
-- 10. Work Items (Tickets & Story Points)
-- ----------------------------------------------------------------------------

create table public.work_items (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  sprint_id uuid references public.sprints(id) on delete set null, -- If sprint deleted, item moves to backlog
  assignee_user_id uuid references auth.users(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  
  -- Core Content
  title text not null,
  description text,
  story_points int not null default 0,
  
  -- Metadata
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'review', 'done')),
  type text not null default 'story' check (type in ('story', 'bug', 'task', 'chore')),
  
  -- External Sync (For future GitHub/Jira integration)
  provider text not null default 'native' check (provider in ('native', 'github', 'jira')),
  external_id text, -- e.g. "ISSUE-42" or "10245"
  external_url text, 
  
  -- Metrics
  completed_at timestamptz, -- Auto-set when status moves to 'done'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger: Updated At
create trigger handle_updated_at before update on public.work_items
  for each row execute procedure public.set_updated_at();

-- Trigger: Auto-set completed_at
create or replace function public.handle_work_item_completion()
returns trigger language plpgsql as $$
begin
  -- If moving TO done, set timestamp
  if new.status = 'done' and old.status != 'done' then
    new.completed_at = now();
  -- If moving AWAY from done, clear timestamp
  elsif new.status != 'done' and old.status = 'done' then
    new.completed_at = null;
  end if;
  return new;
end;
$$;

create trigger set_completion_timestamp before update on public.work_items
  for each row execute procedure public.handle_work_item_completion();

-- RLS: Work Items
alter table public.work_items enable row level security;

create policy "Tenant Isolation: Work Items" on public.work_items
for all
using ( public.is_account_member(account_id) )
with check ( public.is_account_member(account_id) );

-- ----------------------------------------------------------------------------
-- Historical Metrics (Onboarding / Hydration)
-- Stores legacy data imported when a customer signs up.
-- ----------------------------------------------------------------------------
create table public.historical_metrics (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade not null,
  user_id uuid references public.profiles(user_id) on delete cascade, -- NULL = Team Level Metric
  
  -- Context
  metric_date date not null default current_date,
  import_batch_id text, -- Optional: to track which import/tool this came from
  
  -- The Metrics (Nullable, as not all imports have all data)
  velocity_avg numeric,             -- Calculated velocity from previous tool
  last_sprint_points_completed int,
  last_sprint_items_completed int,
  last_sprint_points_incomplete int,
  last_sprint_items_incomplete int,
  
  -- Soft Metrics
  -- Satisfaction
  satisfaction_score int check (satisfaction_score between 1 and 5),

  -- Flow Score: Perceived ability to focus
  flow_score int check (flow_score between 1 and 5),

  -- Friction Score: Tools/process pain
  friction_score int check (friction_score between 1 and 5),

  -- Safety Score: Psychological safety
  safety_score int check (safety_score between 1 and 5),

  -- Workload Balance Score: Sustainability
  workload_balance_score int check (workload_balance_score between 1 and 5),

  -- Requirement Clarity Score: Clarity of expectations and requirements
  requirement_clarity_score int check (requirement_clarity_score between 1 and 5),

  -- Support Score: Support from team members
  support_score int check (support_score between 1 and 5),

  -- Flex Container
  custom_soft_metrics jsonb default '{}'::jsonb, -- Flexible container for other soft data
  
  created_at timestamptz default now()
);

alter table public.historical_metrics enable row level security;
create policy "View historical metrics" on public.historical_metrics for select using (
  exists (select 1 from public.team_members tm where tm.team_id = historical_metrics.team_id and tm.user_id = auth.uid())
);

-- ----------------------------------------------------------------------------
-- Sprint Commitments (Starting State)
-- Captures the state of the board the moment the Sprint starts (The "Freeze").
-- ----------------------------------------------------------------------------
create table public.sprint_commitments (
  id uuid primary key default gen_random_uuid(),
  sprint_id uuid references public.sprints(id) on delete cascade not null,
  user_id uuid references public.profiles(user_id) on delete cascade, -- NULL = Team Total Commitment
  
  committed_points int default 0,
  committed_items int default 0,
  
  created_at timestamptz default now(),
  unique nulls not distinct (sprint_id, user_id) -- Ensure one commitment record per user per sprint
);

alter table public.sprint_commitments enable row level security;
create policy "View commitments" on public.sprint_commitments for select using (
  exists (select 1 from public.sprints s join public.team_members tm on s.team_id = tm.team_id where s.id = sprint_commitments.sprint_id and tm.user_id = auth.uid())
);

-- ----------------------------------------------------------------------------
-- Sprint Snapshots (Daily Stand-ups)
-- Time-series table populated daily (or per stand-up) to track progress.
-- ----------------------------------------------------------------------------
create table public.sprint_snapshots (
  id uuid primary key default gen_random_uuid(),
  sprint_id uuid references public.sprints(id) on delete cascade not null,
  user_id uuid references public.profiles(user_id) on delete cascade, -- NULL = Team Total Snapshot
  
  snapshot_date date default current_date,
  
  points_completed int default 0,
  points_remaining int default 0,
  items_completed int default 0,
  items_remaining int default 0,
  
  created_at timestamptz default now(),
  unique nulls not distinct (sprint_id, user_id, snapshot_date)
);

alter table public.sprint_snapshots enable row level security;
create policy "View snapshots" on public.sprint_snapshots for select using (
  exists (select 1 from public.sprints s join public.team_members tm on s.team_id = tm.team_id where s.id = sprint_snapshots.sprint_id and tm.user_id = auth.uid())
);