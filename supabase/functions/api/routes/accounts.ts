import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@sprintpulse/shared/database.types.ts';
import { CreateAccountSchema, UpdateAccountSchema } from '@sprintpulse/shared/schemas/index.ts';

const app = new Hono();

// ---------------------------------------------------------------------------
// GET / — List accounts the authenticated user belongs to
// ---------------------------------------------------------------------------
app.get('/', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    // RLS policy "View own accounts" already filters to accounts
    // where the user is a member, so a plain select is sufficient.
    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

// ---------------------------------------------------------------------------
// GET /:id — Get account details
// ---------------------------------------------------------------------------
app.get('/:id', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const id = c.req.param('id');

    const { data, error } = await supabase
        .from('accounts')
        .select('*')
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
// POST / — Create a new account and self-join as owner
// ---------------------------------------------------------------------------
app.post('/', zValidator('json', CreateAccountSchema), async (c) => {
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

    // Pre-generate the account UUID so we don't need .select().
    // Using .select() immediately after insert fails because RLS SELECT policies
    // require an account_member record that hasn't been created yet.
    const accountId = crypto.randomUUID();

    // 1. Create the account
    const { error: accountError } = await supabase
        .from('accounts')
        .insert({ id: accountId, ...body, owner_user_id: user.id });

    if (accountError) {
        // Unique constraint on slug
        if (accountError.code === '23505') {
            return c.json({ error: 'An account with this slug already exists.' }, 409);
        }
        return c.json({ error: accountError.message }, 500);
    }

    // 2. Self-join as owner (RLS only allows adding yourself)
    const { error: memberError } = await supabase
        .from('account_members')
        .insert({
            account_id: accountId,
            user_id: user.id,
            role: 'owner',
        });

    if (memberError) {
        return c.json({
            error: 'Account created but failed to assign owner membership.',
            details: memberError.message,
        }, 500);
    }

    // We fetch the account again so we return a complete row matching the DB
    const { data: accountData, error: fetchError } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', accountId)
        .single();

    if (fetchError) {
        return c.json({ error: 'Account created but failed to fetch.' }, 500);
    }

    return c.json(accountData, 201);
});

// ---------------------------------------------------------------------------
// PATCH /:id — Update an account
// ---------------------------------------------------------------------------
app.patch('/:id', zValidator('json', UpdateAccountSchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const id = c.req.param('id');
    const body = c.req.valid('json');

    const { data, error } = await supabase
        .from('accounts')
        .update(body)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

export default app;
