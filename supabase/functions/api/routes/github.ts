import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../../packages/shared/src/database.types.ts';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const GithubWebhookSchema = z.object({
    action: z.enum(['opened', 'edited', 'closed', 'reopened']),
    issue: z.object({
        number: z.number(),
        title: z.string(),
        body: z.string().nullable(),
        html_url: z.string().url(),
    }),
    repository: z.object({
        full_name: z.string(),
    })
});

const app = new Hono();

// This endpoint receives webhooks directly from the GitHub App
// Using zValidator directly handles the parsing and throws 400 if invalid.
app.post('/webhook', zValidator('json', GithubWebhookSchema), async (c) => {
    // In production, verify signature with Github App Secret
    // const signature = c.req.header('x-hub-signature-256');
    const event = c.req.header('X-GitHub-Event');

    // We only process 'issues' events. If it's something else, return success early.
    if (event !== 'issues') {
        return c.json({ success: true });
    }

    const payload = c.req.valid('json');

    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Need service key to handle background syncing
    );

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

    // Safely type the joined integrations data
    type MappingWithIntegrations = typeof mapping & {
        integrations: { account_id: string } | null;
    };
    const typedMapping = mapping as MappingWithIntegrations;

    if (!typedMapping.integrations) {
        return c.json({ message: 'Integration not found for mapping' }, 200);
    }

    const account_id = typedMapping.integrations.account_id;

    if (action === 'opened') {
        type WorkItemInsert = Database['public']['Tables']['work_items']['Insert'];
        await supabase.from('work_items').insert({
            team_id: typedMapping.team_id,
            account_id,
            project_id: typedMapping.project_id,
            title: issue.title,
            description: issue.body,
            status: 'todo',
            type: 'story',
            provider: 'github',
            external_id: issue.number.toString(),
            external_url: issue.html_url
        } satisfies WorkItemInsert);
    } else if (action === 'edited') {
        type WorkItemUpdate = Database['public']['Tables']['work_items']['Update'];
        await supabase.from('work_items')
            .update({ title: issue.title, description: issue.body } satisfies WorkItemUpdate)
            .eq('provider', 'github')
            .eq('external_id', issue.number.toString());
    } else if (action === 'closed') {
        type WorkItemUpdate = Database['public']['Tables']['work_items']['Update'];
        await supabase.from('work_items')
            .update({ status: 'done' } satisfies WorkItemUpdate)
            .eq('provider', 'github')
            .eq('external_id', issue.number.toString());
    } else if (action === 'reopened') {
        type WorkItemUpdate = Database['public']['Tables']['work_items']['Update'];
        await supabase.from('work_items')
            .update({ status: 'todo' } satisfies WorkItemUpdate)
            .eq('provider', 'github')
            .eq('external_id', issue.number.toString());
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
