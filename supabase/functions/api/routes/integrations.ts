import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../../packages/shared/src/database.types.ts';

const app = new Hono();

app.get('/', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const { data, error } = await supabase
        .from('integrations')
        .select('*, integration_mappings(*)');

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

export default app;
