import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@sprintpulse/shared/database.types.ts';
import { CreateSurveySchema } from '@sprintpulse/shared/schemas/index.ts';

const app = new Hono();

// ---------------------------------------------------------------------------
// GET / — List surveys for an account
// ---------------------------------------------------------------------------
app.get('/', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const accountId = c.req.query('accountId');
    if (!accountId) {
        return c.json({ error: 'Missing required query parameter: accountId' }, 400);
    }

    const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('account_id', accountId);

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

// ---------------------------------------------------------------------------
// GET /:id — Get a full survey with its questions
// ---------------------------------------------------------------------------
app.get('/:id', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const id = c.req.param('id');

    const { data, error } = await supabase
        .from('surveys')
        .select('*, survey_questions(*)')
        .eq('id', id)
        .order('order_index', { ascending: true, referencedTable: 'survey_questions' })
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
// POST / — Create a survey with questions (via DB transaction RPC)
// ---------------------------------------------------------------------------
app.post('/', zValidator('json', CreateSurveySchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const input = c.req.valid('json');

    const { data, error } = await supabase.rpc('create_survey_with_questions', {
        p_account_id: input.account_id,
        p_team_id: input.team_id ?? undefined,
        p_title: input.title,
        p_is_active: input.is_active,
        p_questions: input.questions,
    });

    if (error) {
        if (error.message.includes('Access Denied')) {
            return c.json({ error: error.message }, 403);
        }
        return c.json({ error: error.message }, 500);
    }

    return c.json(data as Record<string, unknown>, 201);
});


// ---------------------------------------------------------------------------
// DELETE /:id — Delete a survey (questions cascade automatically)
// ---------------------------------------------------------------------------
app.delete('/:id', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const id = c.req.param('id');

    const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', id);

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json({ message: 'Survey deleted' }, 200);
});

export default app;
