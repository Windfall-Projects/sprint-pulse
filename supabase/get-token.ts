// Run with: deno run -A ./get-token.ts

import { createClient } from 'npm:@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321'; // Standard local URL

async function main() {
    console.log('--- 🔐 Get Local Access Token ---');
    console.log(`Target: ${SUPABASE_URL}\n`);

    // 1. Get Inputs
    const anonKey = prompt('1. Paste your local Anon Key:');
    if (!anonKey) {
        console.error('❌ Anon Key is required.');
        Deno.exit(1);
    }

    const email = prompt('2. Enter User Email:');
    if (!email) {
        console.error('❌ Email is required.');
        Deno.exit(1);
    }

    const password = prompt('3. Enter User Password:');
    if (!password) {
        console.error('❌ Password is required.');
        Deno.exit(1);
    }

    // 2. Initialize Client
    const supabase = createClient(SUPABASE_URL, anonKey.trim());

    // 3. Authenticate
    console.log(`\n🔄 Attempting login for ${email}...`);
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
    });

    if (error) {
        console.error('\n❌ Login Failed:', error.message);
        Deno.exit(1);
    }

    // 4. Output Token
    console.log('\n✅ SUCCESS! Here is your Access Token:\n');
    console.log(data.session.access_token);
    console.log('\n-----------------------------------');
    console.log('📋 Copy the string above for your "Authorization: Bearer <token>" header.');
}

main();