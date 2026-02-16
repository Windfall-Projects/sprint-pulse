import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@sprintpulse/shared/database.types.ts';
import { GiveKudosSchema } from '@sprintpulse/shared/schemas/index.ts';

const app = new Hono();

// ---------------------------------------------------------------------------
// GET / — List kudos for a team (optionally filtered by sprint)
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
        .from('kudos')
        .select('*, profiles:receiver_user_id(display_name, avatar_url)')
        .eq('team_id', teamId);

    const sprintId = c.req.query('sprintId');
    if (sprintId) {
        query = query.eq('sprint_id', sprintId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

// ---------------------------------------------------------------------------
// POST / — Give kudos (sender from auth, account_id resolved from team)
// ---------------------------------------------------------------------------
app.post('/', zValidator('json', GiveKudosSchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = c.req.valid('json');

    // Resolve account_id from team
    const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('account_id')
        .eq('id', body.team_id)
        .single();

    if (teamError || !team) {
        return c.json({ error: 'Team not found' }, 404);
    }

    const { data, error } = await supabase
        .from('kudos')
        .insert({
            ...body,
            account_id: team.account_id,
            sender_user_id: user.id,
        })
        .select()
        .single();

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data, 201);
});

// ---------------------------------------------------------------------------
// DELETE /:id — Delete own kudos (RLS enforces sender ownership)
// ---------------------------------------------------------------------------
app.delete('/:id', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const id = c.req.param('id');

    const { error } = await supabase
        .from('kudos')
        .delete()
        .eq('id', id);

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json({ message: 'Kudos deleted' }, 200);
});

export default app;
