import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../../packages/shared/src/database.types.ts';
import { GithubWebhookPayloadSchema } from '../../../../packages/shared/src/schemas/index.ts';

const app = new Hono();

// This endpoint receives webhooks directly from the GitHub App
app.post('/webhook', async (c) => {
    // In production, verify signature with Github App Secret
    // const signature = c.req.header('x-hub-signature-256');
    const event = c.req.header('X-GitHub-Event');
    const payload = await c.req.json();

    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Need service key to handle background syncing
    );

    if (event === 'issues') {
        const parsed = GithubWebhookPayloadSchema.safeParse(payload);
        if (!parsed.success) {
            return c.json({ error: 'Invalid payload structure', details: parsed.error.issues }, 400);
        }

        const validPayload = parsed.data;
        const action = validPayload.action;
        const issue = validPayload.issue;
        const repoFullName = validPayload.repository.full_name;

        // Find mapping
        const { data: mapping } = await supabase
            .from('integration_mappings')
            .select('*, integrations(account_id)')
            .eq('external_repo_id', repoFullName)
            .eq('is_active', true)
            .maybeSingle();

        if (!mapping) {
            return c.json({ message: 'No active mapping for this repository' }, 200);
        }

        const account_id = (mapping.integrations as any).account_id;

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
    }

    return c.json({ success: true });
});

// Trigger a pull of existing open issues
app.post('/sync', async (c) => {
    // We use the ANON key + auth header here so RLS ensures the caller has access
    const supabaseUser = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );
    
    // In a real application, this endpoint would:
    // 1. Authenticate user and verify access to mapping
    // 2. Query GitHub Issues API using the `integrations.installation_id`
    // 3. For each existing open issue, upsert into `work_items` leveraging the mapping.
    
    return c.json({ success: true, message: "Sync queued." });
});

export default app;
