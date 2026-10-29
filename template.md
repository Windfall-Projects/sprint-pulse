**File Path:** `supabase/functions/api/routes/github.ts`
**Violated Boundary/Rule:** The Runtime Shield (Zod): Enforce that ALL incoming request payloads (body, query params, headers) are dynamically validated using Zod schemas imported from `@sprintpulse` (e.g., via `@hono/zod-validator`). Flag any route that parses a request without runtime validation.

**Failing Code Snippet:**
\`\`\`typescript
app.post('/webhook', async (c) => {
    // In production, verify signature with Github App Secret
    // const signature = c.req.header('x-hub-signature-256');
    const event = c.req.header('X-GitHub-Event');
    const payload = await c.req.json();
\`\`\`

**Required Correction:** Import `@hono/zod-validator` and the appropriate Zod schema from `@sprintpulse` to validate the incoming webhook payload. Replace `c.req.json()` and `c.req.header()` parsing with the Hono `zValidator` middleware.

---
**File Path:** `supabase/functions/api/routes/github.ts`
**Violated Boundary/Rule:** The Compile-Time Anchor (Supabase): Ensure that the data passed from the validated request into the database layer strictly aligns with the generated Supabase types. Flag any route handler that manually types a database response or payload instead of using the shared types.

**Failing Code Snippet:**
\`\`\`typescript
        if (action === 'opened') {
            await supabase.from('work_items').insert({
                team_id: mapping.team_id,
                account_id,
                project_id: mapping.project_id,
                title: issue.title,
                description: issue.body,
                status: 'todo',
                type: 'story',
                provider: 'github',
                external_id: issue.number.toString(),
                external_url: issue.html_url
            } as any);
        } else if (action === 'edited') {
            await supabase.from('work_items')
                .update({ title: issue.title, description: issue.body } as any)
                .eq('provider', 'github')
                .eq('external_id', issue.number.toString());
        } else if (action === 'closed') {
            await supabase.from('work_items')
                .update({ status: 'done' } as any)
                .eq('provider', 'github')
                .eq('external_id', issue.number.toString());
        } else if (action === 'reopened') {
            await supabase.from('work_items')
                .update({ status: 'todo' } as any)
                .eq('provider', 'github')
                .eq('external_id', issue.number.toString());
        }
\`\`\`

**Required Correction:** Remove all usages of `as any` when interacting with the Supabase client. Ensure the properties being inserted or updated strictly align with the generated Supabase types for the `work_items` table.
---
**File Path:** `supabase/functions/tests/virtual_profiles_test.ts`
**Violated Boundary/Rule:** Test Boundaries: Analyze API test suites for proper isolation. Pure unit tests for business logic must mock Supabase. Integration tests (e.g., `.http` requests or tests touching the local Supabase environment) must be explicitly segregated and must not bleed into standard unit test runs.

**Failing Code Snippet:**
\`\`\`typescript
// Hardcoded for local dev environment verification
const SUPABASE_URL = "http://127.0.0.1:54321";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

Deno.test({
    name: "Virtual Profiles Lifecycle",
    sanitizeOps: false,
    sanitizeResources: false,
    fn: async () => {
        console.log("LOG: Test Starting...");

        try {
            const supabase = createClient<Database>(
                SUPABASE_URL,
                SUPABASE_SERVICE_ROLE_KEY
            );
\`\`\`

**Required Correction:** Segregate this integration test from the standard unit test suite. If testing business logic, mock the Supabase client. If this is intended as an integration test, move it to a dedicated integration test directory or use a distinct file naming convention (e.g., `virtual_profiles.integration.test.ts`) and ensure it is not executed alongside pure unit tests.
