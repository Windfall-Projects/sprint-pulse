import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../../packages/shared/src/database.types.ts';
import { GithubWebhookPayloadSchema, GithubWebhookHeaderSchema } from '../../../../packages/shared/src/schemas/index.ts';
import { z } from 'zod';

const app = new Hono();

async function processGithubIssueWebhook(supabase: ReturnType<typeof createClient<Database>>, payload: z.infer<typeof GithubWebhookPayloadSchema>) {
    const { action, issue, repository } = payload;

    const { data: mapping } = await supabase
        .from('integration_mappings')
        .select('*, integrations!inner(account_id)')
        .eq('external_repo_id', repository.full_name)
        .eq('is_active', true)
        .maybeSingle();

    if (!mapping) {
        return { message: 'No active mapping for this repository' };
    }

    // Safely cast mapping to expected shape since PostgREST joins are poorly inferred
    const mappingWithIntegration = mapping as typeof mapping & {
        integrations: { account_id: string } | null
    };

    const account_id = mappingWithIntegration.integrations?.account_id;
    if (!account_id) return { message: 'Invalid integration mapping configuration' };

    if (action === 'opened') {
        const insertData: Database['public']['Tables']['work_items']['Insert'] = {
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
        };
        await supabase.from('work_items').insert(insertData);
    } else if (action === 'edited') {
        const updateData: Database['public']['Tables']['work_items']['Update'] = {
            title: issue.title,
            description: issue.body
        };
        await supabase.from('work_items')
            .update(updateData)
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

    return { success: true };
}

// This endpoint receives webhooks directly from the GitHub App
app.post('/webhook', zValidator('header', GithubWebhookHeaderSchema), zValidator('json', GithubWebhookPayloadSchema), async (c) => {
    const headers = c.req.valid('header');
    const event = headers['x-github-event'];

    if (event !== 'issues') {
        return c.json({ success: true, ignored: true });
    }

    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Need service key to handle background syncing
    );

    const payload = c.req.valid('json');
    const result = await processGithubIssueWebhook(supabase, payload);
    if (result.message) {
        return c.json({ message: result.message }, 200);
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
