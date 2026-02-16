import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@sprintpulse/shared/database.types.ts';
import { CreateTeamMemberSchema, UpdateTeamMemberSchema } from '@sprintpulse/shared/schemas/index.ts';

const app = new Hono();

// ---------------------------------------------------------------------------
// GET / — List members of a team (with profile details)
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
        .from('team_members')
        .select('*, profiles(display_name, avatar_url)')
        .eq('team_id', teamId)
        .order('joined_at', { ascending: true });

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

// ---------------------------------------------------------------------------
// POST / — Add a member to a team
// ---------------------------------------------------------------------------
app.post('/', zValidator('json', CreateTeamMemberSchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const body = c.req.valid('json');

    const { data, error } = await supabase
        .from('team_members')
        .insert(body)
        .select()
        .single();

    if (error) {
        // Composite PK violation = already a member
        if (error.code === '23505') {
            return c.json({ error: 'User is already a member of this team.' }, 409);
        }
        return c.json({ error: error.message }, 500);
    }

    return c.json(data, 201);
});

// ---------------------------------------------------------------------------
// PATCH /:teamId/:userId — Update a team member's role or title
// ---------------------------------------------------------------------------
app.patch('/:teamId/:userId', zValidator('json', UpdateTeamMemberSchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const teamId = c.req.param('teamId');
    const userId = c.req.param('userId');
    const body = c.req.valid('json');

    const { data, error } = await supabase
        .from('team_members')
        .update(body)
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .select()
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
// DELETE /:teamId/:userId — Remove a member from a team
// ---------------------------------------------------------------------------
app.delete('/:teamId/:userId', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const teamId = c.req.param('teamId');
    const userId = c.req.param('userId');

    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json({ message: 'Team member removed' }, 200);
});

export default app;
