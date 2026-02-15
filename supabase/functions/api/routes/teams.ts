import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../../packages/shared/src/database.types.ts';
import { CreateTeamSchema } from '../../../../packages/shared/src/schemas/index.ts';

const app = new Hono();

app.get('/', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const { data, error } = await supabase.from('teams').select('*');

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

app.get('/mine', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data, error } = await supabase
        .from('teams')
        .select('*, team_members!inner(role)')
        .eq('team_members.user_id', user.id);

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

app.post('/', zValidator('json', CreateTeamSchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const body = c.req.valid('json');
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    // 1. Insert Team
    const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert(body)
        .select()
        .single();

    if (teamError) {
        return c.json({ error: teamError.message }, 500);
    }

    // 2. Insert Member (Lead)
    try {
        const { error: memberError } = await supabase
            .from('team_members')
            .insert({
                team_id: team.id,
                user_id: user.id,
                role: 'lead'
            });

        if (memberError) throw memberError;
    } catch (error) {
        // Edge case: Team created but member insertion failed.
        // Ideally we might want to revert the team creation, but given REST limitations
        // and requirements, we return an error.
        return c.json({
            error: 'Team created but failed to assign lead role.',
            details: error,
            team
        }, 500);
    }

    return c.json(team, 201);
});

app.get('/:id', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const id = c.req.param('id');
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return c.json({ error: error.message }, 404);
    }

    return c.json(data);
});

export default app;
