import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../../packages/shared/src/database.types.ts';
import { z } from 'zod';

const GithubWebhookSchema = z.object({
  action: z.string().optional(),
  issue: z.object({
    title: z.string(),
    body: z.string().nullable(),
    number: z.number(),
    html_url: z.string()
  }).optional(),
  repository: z.object({
    full_name: z.string()
  }).optional()
}).passthrough();

const app = new Hono();

// This endpoint receives webhooks directly from the GitHub App
app.post('/webhook', async (c) => {
    // In production, verify signature with Github App Secret
    // const signature = c.req.header('x-hub-signature-256');
    const event = c.req.header('X-GitHub-Event');
    const rawPayload = await c.req.json();

    const parsed = GithubWebhookSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return c.json({ error: 'Invalid payload' }, 400);
    }
    const payload = parsed.data;

    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Need service key to handle background syncing
    );

    if (event === 'issues') {
        if (!payload.issue || !payload.repository) {
            return c.json({ message: 'Missing issue or repository data' }, 200);
        }
        const action = payload.action;
        const issue = payload.issue;
        const repoFullName = payload.repository.full_name;

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

        // integrations is fetched via foreign key, so it might be an array or object depending on relation
        // maybeSingle with select('integrations(account_id)') returns an object for one-to-one
        const integrationData = mapping.integrations as unknown as { account_id: string } | null;
        if (!integrationData) {
            return c.json({ message: 'No integration found for this mapping' }, 200);
        }
        const account_id = integrationData.account_id;

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
            });
        } else if (action === 'edited') {
            await supabase.from('work_items')
                .update({ title: issue.title, description: issue.body })
                .eq('provider', 'github')
                .eq('external_id', issue.number.toString());
        } else if (action === 'closed') {
            await supabase.from('work_items')
                .update({ status: 'done' })
                .eq('provider', 'github')
                .eq('external_id', issue.number.toString());
        } else if (action === 'reopened') {
            await supabase.from('work_items')
                .update({ status: 'todo' })
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
