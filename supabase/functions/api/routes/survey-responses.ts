import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@sprintpulse/shared/database.types.ts';
import { SubmitSurveyResponseSchema } from '@sprintpulse/shared/schemas/index.ts';

const app = new Hono();

// ---------------------------------------------------------------------------
// GET / — List survey responses (filterable by surveyId, sprintId)
// ---------------------------------------------------------------------------
app.get('/', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const surveyId = c.req.query('surveyId');
    const sprintId = c.req.query('sprintId');

    if (!surveyId && !sprintId) {
        return c.json({ error: 'At least one query parameter required: surveyId or sprintId' }, 400);
    }

    let query = supabase
        .from('survey_responses')
        .select('*, survey_answers(*)');

    if (surveyId) {
        query = query.eq('survey_id', surveyId);
    }

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
// GET /:id — Get a single response with its answers
// ---------------------------------------------------------------------------
app.get('/:id', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const id = c.req.param('id');

    const { data, error } = await supabase
        .from('survey_responses')
        .select('*, survey_answers(*)')
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
// POST / — Submit a survey response with answers
// ---------------------------------------------------------------------------
app.post('/', zValidator('json', SubmitSurveyResponseSchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const input = c.req.valid('json');

    // 1. Create the response record
    const { data: response, error: responseError } = await supabase
        .from('survey_responses')
        .insert({
            survey_id: input.survey_id,
            sprint_id: input.sprint_id,
            responder_profile_id: user.id,
            is_confidential: input.is_confidential,
        })
        .select()
        .single();

    if (responseError) {
        return c.json({ error: responseError.message }, 500);
    }

    // 2. Insert answers linked to the response
    if (input.answers.length > 0) {
        const answerRows = input.answers.map((a) => ({
            response_id: response.id,
            question_id: a.question_id,
            value_text: a.value_text ?? null,
            value_number: a.value_number ?? null,
            value_json: (a.value_json ?? null) as Database['public']['Tables']['survey_answers']['Insert']['value_json'],
        }));

        const { error: answersError } = await supabase
            .from('survey_answers')
            .insert(answerRows);

        if (answersError) {
            return c.json({
                error: 'Response created but failed to save answers.',
                details: answersError.message,
                response,
            }, 500);
        }
    }

    // 3. Return the full response with answers
    const { data: full, error: fetchError } = await supabase
        .from('survey_responses')
        .select('*, survey_answers(*)')
        .eq('id', response.id)
        .single();

    if (fetchError) {
        return c.json(response, 201);
    }

    return c.json(full, 201);
});

// ---------------------------------------------------------------------------
// DELETE /:id — Delete own response (answers cascade automatically)
// ---------------------------------------------------------------------------
app.delete('/:id', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const id = c.req.param('id');

    // RLS ensures only the owner can delete their own response
    const { error } = await supabase
        .from('survey_responses')
        .delete()
        .eq('id', id);

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json({ message: 'Response deleted' }, 200);
});

export default app;
