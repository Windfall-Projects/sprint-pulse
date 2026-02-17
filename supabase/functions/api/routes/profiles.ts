import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@sprintpulse/shared/database.types.ts';
import { ProfileSchema, UpdateProfileSchema } from '@sprintpulse/shared/schemas/index.ts';

// Schema for creating a profile (Virtual)
// We reuse ProfileSchema but make some fields optional/required as needed
const CreateProfileSchema = ProfileSchema.pick({
    display_name: true,
    avatar_url: true,
});

const app = new Hono();

// ---------------------------------------------------------------------------
// GET /me — Get the authenticated user's profile
// ---------------------------------------------------------------------------
app.get('/me', async (c) => {
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
        .from('profiles')
        .select('*')
        .eq('auth_user_id', user.id)
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
// PATCH /me — Update the authenticated user's profile
// ---------------------------------------------------------------------------
app.patch('/me', zValidator('json', UpdateProfileSchema), async (c) => {
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
        .from('profiles')
        .update(body)
        .eq('auth_user_id', user.id)
        .select()
        .single();

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});

// ---------------------------------------------------------------------------
// GET /:id — Get a user's profile by user_id
// ---------------------------------------------------------------------------
app.get('/:id', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const id = c.req.param('id');

    const { data, error } = await supabase
        .from('profiles')
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
// POST / — Create a new profile (Virtual Profile)
// ---------------------------------------------------------------------------
app.post('/', zValidator('json', CreateProfileSchema), async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const body = c.req.valid('json');

    // Create a profile with NO auth_user_id
    const { data, error } = await supabase
        .from('profiles')
        .insert({
            display_name: body.display_name,
            avatar_url: body.avatar_url,
            // auth_user_id is null by default
        })
        .select()
        .single();

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data, 201);
});

// ---------------------------------------------------------------------------
// DELETE /:id — Delete a profile
// ---------------------------------------------------------------------------
app.delete('/:id', async (c) => {
    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );

    const id = c.req.param('id');

    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json({ message: 'Profile deleted' }, 200);
});

export default app;
