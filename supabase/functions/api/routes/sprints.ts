import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@sprintpulse/shared/database.types.ts';
import { CreateSprintSchema, UpdateSprintSchema } from '@sprintpulse/shared/schemas/index.ts';

const app = new Hono();

// ---------------------------------------------------------------------------
// GET / — List sprints for a team
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

    const { data, error } = await supabase
        .from('sprints')
        .select('*')
        .eq('team_id', teamId)
        .order('end_date', { ascending: false });

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

// ---------------------------------------------------------------------------
// POST / — Create a new sprint
// ---------------------------------------------------------------------------
app.post('/', zValidator('json', CreateSprintSchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const body = c.req.valid('json');

    // Resolve the team's account_id (required by DB but not in Zod schema)
    const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('account_id')
        .eq('id', body.team_id)
        .single();

    if (teamError || !team) {
        return c.json({ error: 'Team not found' }, 404);
    }

    const { data, error } = await supabase
        .from('sprints')
        .insert({ ...body, account_id: team.account_id })
        .select()
        .single();

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data, 201);
});

// ---------------------------------------------------------------------------
// PATCH /:id — Update / close a sprint
// ---------------------------------------------------------------------------
app.patch('/:id', zValidator('json', UpdateSprintSchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const id = c.req.param('id');
    const body = c.req.valid('json');

    const { data, error } = await supabase
        .from('sprints')
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
// DELETE /:id — Delete a sprint
// ---------------------------------------------------------------------------
app.delete('/:id', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const id = c.req.param('id');

    const { error } = await supabase
        .from('sprints')
        .delete()
        .eq('id', id);

    if (error) {
        // FK violation: work items still reference this sprint (RESTRICT)
        if (error.code === '23503') {
            return c.json({
                error: 'Cannot delete sprint: it still has associated work items. Remove them first.',
            }, 409);
        }
        return c.json({ error: error.message }, 500);
    }

    return c.json({ message: 'Sprint deleted' }, 200);
});

export default app;
