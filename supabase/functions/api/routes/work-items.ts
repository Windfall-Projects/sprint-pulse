import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@sprintpulse/shared/database.types.ts';
import { CreateWorkItemSchema, UpdateWorkItemSchema } from '@sprintpulse/shared/schemas/index.ts';

const app = new Hono();

// ---------------------------------------------------------------------------
// GET / — List work items (filterable by teamId, sprintId, status, assignee)
// ---------------------------------------------------------------------------
app.get('/', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const teamId = c.req.query('teamId');
    if (!teamId) {
        return c.json({ error: 'Missing required query parameter: teamId' }, 400);
    }

    let query = supabase
        .from('work_items')
        .select('*')
        .eq('team_id', teamId);

    // Optional filters
    const sprintId = c.req.query('sprintId');
    if (sprintId) {
        query = query.eq('sprint_id', sprintId);
    }

    const status = c.req.query('status');
    if (status) {
        query = query.eq('status', status);
    }

    const assigneeUserId = c.req.query('assigneeUserId');
    if (assigneeUserId) {
        query = query.eq('assignee_user_id', assigneeUserId);
    }

    const projectId = c.req.query('projectId');
    if (projectId) {
        query = query.eq('project_id', projectId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

// ---------------------------------------------------------------------------
// GET /:id — Get a single work item
// ---------------------------------------------------------------------------
app.get('/:id', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const id = c.req.param('id');

    const { data, error } = await supabase
        .from('work_items')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return c.json(
            { error: error.message },
            error.code === 'PGRST116' ? 404 : 500
        );
    }

    return c.json(data);
});

// ---------------------------------------------------------------------------
// POST / — Create a work item (resolves account_id from team)
// ---------------------------------------------------------------------------
app.post('/', zValidator('json', CreateWorkItemSchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const body = c.req.valid('json');

    // Resolve account_id from the team (required by DB but not in the input schema)
    const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('account_id')
        .eq('id', body.team_id)
        .single();

    if (teamError || !team) {
        return c.json({ error: 'Team not found' }, 404);
    }

    const { data, error } = await supabase
        .from('work_items')
        .insert({ ...body, account_id: team.account_id })
        .select()
        .single();

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data, 201);
});

// ---------------------------------------------------------------------------
// PATCH /:id — Update a work item
// ---------------------------------------------------------------------------
app.patch('/:id', zValidator('json', UpdateWorkItemSchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const id = c.req.param('id');
    const body = c.req.valid('json');

    const { data, error } = await supabase
        .from('work_items')
        .update(body)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

// ---------------------------------------------------------------------------
// DELETE /:id — Delete a work item
// ---------------------------------------------------------------------------
app.delete('/:id', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const id = c.req.param('id');

    const { error } = await supabase
        .from('work_items')
        .delete()
        .eq('id', id);

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json({ message: 'Work item deleted' }, 200);
});

export default app;
