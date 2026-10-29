const fs = require('fs');

const report1 = `**File Path:** \`apps/web/src/app/(auth)/actions.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace.\`

**Failing Code Snippet:**
\`\`\`typescript
export async function signupAction(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const displayName = formData.get('displayName') as string

  if (!email || !password || !displayName) {
    return { error: 'Please fill out all fields' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
\`\`\`

**Required Correction:** \`Refactor signupAction and loginAction to parse and validate formData using the appropriate Zod schemas imported from @sprintpulse/shared before processing.\`
`;

const report2 = `**File Path:** \`apps/web/src/app/onboarding/actions.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace.\`

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
`;

const report3 = `**File Path:** \`apps/web/src/app/(dashboard)/pulse/actions.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace.\`

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

**Required Correction:** \`Refactor createSurvey to parse and validate formData using the appropriate Zod schema imported from @sprintpulse/shared before processing.\`
`;

const report4 = `**File Path:** \`apps/web/src/app/(dashboard)/backlog/actions.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace.\`

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

**Required Correction:** \`Refactor createWorkItem to parse and validate formData using the appropriate Zod schema imported from @sprintpulse/shared before processing.\`
`;

const report5 = `**File Path:** \`apps/web/src/app/(dashboard)/projects/actions.ts\`
**Violated Boundary/Rule:** \`The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace.\`

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
`;

const allReports = report1 + '\n\n---\n\n' + report2 + '\n\n---\n\n' + report3 + '\n\n---\n\n' + report4 + '\n\n---\n\n' + report5;
fs.writeFileSync('issue_report.txt', allReports);
