import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@sprintpulse/shared/database.types.ts';
import { CreateSprintSnapshotSchema } from '@sprintpulse/shared/schemas/index.ts';

const app = new Hono();

// ---------------------------------------------------------------------------
// GET / — List snapshots for a sprint (time-series for burndown charts)
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
        .from('sprint_snapshots')
        .select('*')
        .eq('sprint_id', sprintId)
        .order('snapshot_date', { ascending: true });

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

// ---------------------------------------------------------------------------
// POST / — Record a daily snapshot
// ---------------------------------------------------------------------------
app.post('/', zValidator('json', CreateSprintSnapshotSchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const body = c.req.valid('json');

    const { data, error } = await supabase
        .from('sprint_snapshots')
        .insert(body)
        .select()
        .single();

    if (error) {
        // Unique constraint: one snapshot per user per sprint per date
        if (error.code === '23505') {
            return c.json({ error: 'Snapshot already exists for this user, sprint, and date.' }, 409);
        }
        return c.json({ error: error.message }, 500);
    }

    return c.json(data, 201);
});

export default app;
