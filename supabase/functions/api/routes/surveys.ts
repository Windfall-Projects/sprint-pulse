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
// POST / — Create a survey with questions (pseudo-transaction)
// ---------------------------------------------------------------------------
app.post('/', zValidator('json', CreateSurveySchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const input = c.req.valid('json');

    // Step 1: Insert the survey
    const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .insert({
            account_id: input.account_id,
            team_id: input.team_id ?? null,
            title: input.title,
            is_active: input.is_active,
        })
        .select()
        .single();

    if (surveyError || !survey) {
        return c.json({ error: surveyError?.message ?? 'Failed to create survey' }, 500);
    }

    // Step 2: Prepare questions with the new survey_id
    const questionsToInsert = input.questions.map((q) => ({
        survey_id: survey.id,
        question_text: q.question_text,
        response_type: q.question_type,
        order_index: q.order_index,
        is_required: q.is_required,
    }));

    // Step 3: Insert questions
    const { data: createdQuestions, error: questionsError } = await supabase
        .from('survey_questions')
        .insert(questionsToInsert)
        .select();

    // Step 4: If questions fail, rollback the survey to prevent ghost records
    if (questionsError) {
        await supabase.from('surveys').delete().eq('id', survey.id);
        return c.json({ error: questionsError.message }, 500);
    }

    return c.json({ ...survey, questions: createdQuestions }, 201);
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
