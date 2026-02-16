import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@sprintpulse/shared/database.types.ts';
import { CreateSprintCommitmentSchema } from '@sprintpulse/shared/schemas/index.ts';

const app = new Hono();

// ---------------------------------------------------------------------------
// GET / — List commitments for a sprint
// ---------------------------------------------------------------------------
app.get('/', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const sprintId = c.req.query('sprintId');
    if (!sprintId) {
        return c.json({ error: 'Missing required query parameter: sprintId' }, 400);
    }

    const { data, error } = await supabase
        .from('sprint_commitments')
        .select('*, profiles:user_id(display_name)')
        .eq('sprint_id', sprintId)
        .order('created_at', { ascending: true });

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

// ---------------------------------------------------------------------------
// POST / — Record a sprint commitment
// ---------------------------------------------------------------------------
app.post('/', zValidator('json', CreateSprintCommitmentSchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const body = c.req.valid('json');

    const { data, error } = await supabase
        .from('sprint_commitments')
        .insert(body)
        .select()
        .single();

    if (error) {
        // Unique constraint: one commitment per user per sprint
        if (error.code === '23505') {
            return c.json({ error: 'Commitment already exists for this user and sprint.' }, 409);
        }
        return c.json({ error: error.message }, 500);
    }

    return c.json(data, 201);
});

export default app;
