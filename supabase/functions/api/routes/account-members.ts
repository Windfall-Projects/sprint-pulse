import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@sprintpulse/shared/database.types.ts';
import { JoinAccountSchema } from '@sprintpulse/shared/schemas/index.ts';

const app = new Hono();

// ---------------------------------------------------------------------------
// GET / — List members of an account
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

    // Join with profiles to return member details alongside their role
    const { data, error } = await supabase
        .from('account_members')
        .select('*, profiles(display_name, avatar_url)')
        .eq('account_id', accountId)
        .order('created_at', { ascending: true });

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

// ---------------------------------------------------------------------------
// POST / — Join an account (self-join only, enforced by RLS)
// ---------------------------------------------------------------------------
app.post('/', zValidator('json', JoinAccountSchema), async (c) => {
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

    const { data, error } = await supabase
        .from('account_members')
        .insert({
            account_id: body.account_id,
            user_id: user.id,
            role: body.role,
        })
        .select()
        .single();

    if (error) {
        // Composite PK violation = already a member
        if (error.code === '23505') {
            return c.json({ error: 'User is already a member of this account.' }, 409);
        }
        return c.json({ error: error.message }, 500);
    }

    return c.json(data, 201);
});

export default app;
