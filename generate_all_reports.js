const fs = require('fs');

const createReport = (file, schemaName, funcName) => `**File Path:** \`${file}\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.\`

**Failing Code Snippet:**
\`\`\`typescript
export async function ${funcName}(formData: FormData) {
\`\`\`

**Required Correction:** \`Refactor ${funcName} to parse and validate formData using the appropriate Zod schema imported from @sprintpulse/shared before processing.\`
`;

const reports = [];

reports.push(`**File Path:** \`apps/web/src/app/(auth)/actions.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.\`

**Failing Code Snippet:**
\`\`\`typescript
export async function loginAction(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Please enter both email and password' }
  }
\`\`\`

**Required Correction:** \`Refactor loginAction and signupAction to parse and validate formData using the appropriate Zod schemas imported from @sprintpulse/shared before processing.\`
`);

reports.push(`**File Path:** \`apps/web/src/app/onboarding/actions.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.\`

**Failing Code Snippet:**
\`\`\`typescript
export async function createWorkspaceAction(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const workspaceName = formData.get('workspaceName') as string

  if (!workspaceName || workspaceName.trim() === '') {
    return { error: 'Please enter a workspace name' }
  }
\`\`\`

**Required Correction:** \`Refactor createWorkspaceAction to parse and validate formData using the appropriate Zod schema imported from @sprintpulse/shared before processing.\`
`);

reports.push(`**File Path:** \`apps/web/src/app/(dashboard)/pulse/actions.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.\`

**Failing Code Snippet:**
\`\`\`typescript
export async function createSurvey(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const teamId = formData.get('teamId') as string
  const accountId = formData.get('accountId') as string

  if (!title) return { error: 'Title is required' }
\`\`\`

**Required Correction:** \`Refactor createSurvey to parse and validate formData using the CreateSurveySchema imported from @sprintpulse/shared before processing.\`
`);

reports.push(`**File Path:** \`apps/web/src/app/(dashboard)/backlog/actions.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.\`

**Failing Code Snippet:**
\`\`\`typescript
export async function createWorkItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  const type = formData.get('type') as string
  const points = parseInt(formData.get('points') as string || '0', 10)
  const teamId = formData.get('teamId') as string
  const accountId = formData.get('accountId') as string

  if (!title) return { error: 'Title is required' }
\`\`\`

**Required Correction:** \`Refactor createWorkItem to parse and validate formData using the CreateWorkItemSchema imported from @sprintpulse/shared before processing.\`
`);

reports.push(`**File Path:** \`apps/web/src/app/(dashboard)/projects/actions.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.\`

**Failing Code Snippet:**
\`\`\`typescript
export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const teamId = formData.get('teamId') as string

  if (!name || name.trim() === '') return { error: 'Name is required' }
  if (!teamId) return { error: 'Team is required' }
\`\`\`

**Required Correction:** \`Refactor createProject to parse and validate formData using the CreateProjectSchema imported from @sprintpulse/shared before processing.\`
`);

reports.push(`**File Path:** \`apps/web/src/app/(dashboard)/settings/actions.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.\`

**Failing Code Snippet:**
\`\`\`typescript
export async function updateProfileAction(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const displayName = formData.get('displayName') as string
  const avatarUrl = formData.get('avatarUrl') as string

  if (!displayName || displayName.trim() === '') {
    return { error: 'Display Name is required' }
  }
\`\`\`

**Required Correction:** \`Refactor updateProfileAction to parse and validate formData using the appropriate Zod schema imported from @sprintpulse/shared before processing.\`
`);

reports.push(`**File Path:** \`apps/web/src/app/(dashboard)/settings/workspace/actions.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.\`

**Failing Code Snippet:**
\`\`\`typescript
export async function updateWorkspaceName(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const accountId = formData.get('accountId') as string
  const name = formData.get('name') as string

  if (!name || name.trim() === '') {
    return { error: 'Workspace name is required' }
  }
\`\`\`

**Required Correction:** \`Refactor updateWorkspaceName and other actions to parse and validate formData using the appropriate Zod schemas imported from @sprintpulse/shared before processing.\`
`);

reports.push(`**File Path:** \`apps/web/src/app/(dashboard)/sprints/actions.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.\`

**Failing Code Snippet:**
\`\`\`typescript
export async function createSprint(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const name = formData.get('name') as string
  const goal = formData.get('goal') as string
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string
  const teamId = formData.get('teamId') as string
\`\`\`

**Required Correction:** \`Refactor createSprint to parse and validate formData using the appropriate Zod schema imported from @sprintpulse/shared before processing.\`
`);

reports.push(`**File Path:** \`apps/web/src/app/(dashboard)/teams/actions.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.\`

**Failing Code Snippet:**
\`\`\`typescript
export async function createTeam(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const accountId = formData.get('accountId') as string
  const name = formData.get('name') as string

  if (!name || name.trim() === '') return { error: 'Name is required' }
\`\`\`

**Required Correction:** \`Refactor createTeam and other actions to parse and validate formData using the appropriate Zod schemas imported from @sprintpulse/shared before processing.\`
`);

reports.push(`**File Path:** \`apps/web/src/app/(dashboard)/kudos/actions.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.\`

**Failing Code Snippet:**
\`\`\`typescript
export async function createKudos(formData: FormData) {
  const supabase = await createClient()

  const accountId = formData.get('accountId') as string
  const teamId = formData.get('teamId') as string
  const senderProfileId = formData.get('senderProfileId') as string
  const receiverProfileId = formData.get('receiverProfileId') as string
  const category = formData.get('category') as string
  const message = formData.get('message') as string

  if (!message || !receiverProfileId) return { error: 'Required fields missing' }
\`\`\`

**Required Correction:** \`Refactor createKudos to parse and validate formData using the GiveKudosSchema imported from @sprintpulse/shared before processing.\`
`);

const allReports = reports.join('\n\n---\n\n');
fs.writeFileSync('issue_report.txt', allReports);


const newReport = `**File Path:** \`apps/web/src/app/(dashboard)/settings/integrations/_actions/github.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.\`

**Failing Code Snippet:**
\`\`\`typescript
export async function createIntegrationMapping({
  integrationId, externalRepoId, teamId, projectId
}: {
  integrationId: string,
  externalRepoId: string,
  teamId: string,
  projectId?: string
}) {
  const supabase = await createClient()

  const payload: any = {
    integration_id: integrationId,
    external_repo_id: externalRepoId,
    team_id: teamId,
    is_active: true
  }

  if (projectId) {
    payload.project_id = projectId;
  }
\`\`\`

**Required Correction:** \`Refactor createIntegrationMapping to parse and validate the input payload using the CreateIntegrationMappingSchema imported from @sprintpulse/shared before processing.\`
`;

const existing = fs.readFileSync('issue_report.txt', 'utf-8');
fs.writeFileSync('issue_report.txt', existing + '\n\n---\n\n' + newReport);
