import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@sprintpulse/shared/database.types.ts';
import { CreateHistoricalMetricSchema } from '@sprintpulse/shared/schemas/index.ts';

const app = new Hono();

// ---------------------------------------------------------------------------
// GET / — List historical metrics for a team
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
        .from('historical_metrics')
        .select('*')
        .eq('team_id', teamId)
        .order('metric_date', { ascending: false });

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

// ---------------------------------------------------------------------------
// POST / — Import historical metric data
// ---------------------------------------------------------------------------
app.post('/', zValidator('json', CreateHistoricalMetricSchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const body = c.req.valid('json');

    const insertPayload = {
        ...body,
        custom_soft_metrics: body.custom_soft_metrics as Database['public']['Tables']['historical_metrics']['Insert']['custom_soft_metrics'],
    };

    const { data, error } = await supabase
        .from('historical_metrics')
        .insert(insertPayload)
        .select()
        .single();

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data, 201);
});

export default app;
