
import { assertEquals, assertExists } from "std/assert";
import "std/dotenv/load";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../packages/shared/src/database.types.ts";

// Hardcoded for local dev environment verification
const SUPABASE_URL = "http://127.0.0.1:54321";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvY2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";
const FUNCTIONS_URL = "http://127.0.0.1:54321/functions/v1";

Deno.test({
    name: "Accounts API: Update Account Name",
    sanitizeOps: false,
    sanitizeResources: false,
    fn: async () => {
        console.log("LOG: Test Starting...");

        // 1. Setup Admin Client
        const adminSupabase = createClient<Database>(
            SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY
        );

        // 2. Create a Test User
        const email = `test_user_${Date.now()}@example.com`;
        const password = "password123";
        const { data: user, error: userError } = await adminSupabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });

        if (userError || !user.user) {
            console.error("LOG: User Create Error:", userError);
            throw userError;
        }
        console.log("LOG: Created User:", user.user.id);

        // 3. Login to get Session (Access Token)
        const clientSupabase = createClient<Database>(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );
        const { data: session, error: loginError } = await clientSupabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError || !session.session) {
            console.error("LOG: Login Error:", loginError);
            throw loginError;
        }
        const token = session.session.access_token;
        console.log("LOG: Got Session Token:", token.substring(0, 20) + "...");

        // Use Session Token for API calls to bypass "Unauthorized" due to lack of user context
        const apiToken = token;

        // 4. Create an Account (via API to simulate real flow)
        const accountName = "Test Account " + Date.now();
        const accountSlug = "test-slug-" + Date.now();

        const createRes = await fetch(`${FUNCTIONS_URL}/api/accounts`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: accountName,
                slug: accountSlug,
            }),
        });

        if (!createRes.ok) {
            console.error("LOG: Account Create Failed Status:", createRes.status);
            const text = await createRes.text();
            console.error("LOG: Account Create Failed Body:", text);
            throw new Error(`Failed to create account: ${text}`);
        }

        const createdAccount = await createRes.json();
        assertExists(createdAccount.id);
        assertEquals(createdAccount.name, accountName);
        console.log("LOG: Created Account:", createdAccount.id);

        // 5. Update Account Name
        const newName = "Updated Account Name " + Date.now();
        const updateRes = await fetch(`${FUNCTIONS_URL}/api/accounts/${createdAccount.id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: newName,
            }),
        });

        const updatedAccount = await updateRes.json();
        if (!updateRes.ok) {
            console.error("LOG: Account Update Error:", updatedAccount);
            throw new Error(`Failed to update account: ${JSON.stringify(updatedAccount)}`);
        }

        // 6. Verify Update
        assertEquals(updatedAccount.name, newName);
        console.log("LOG: Update Verified via API Response");

        // Verify in DB directly
        const { data: dbAccount, error: dbError } = await adminSupabase
            .from("accounts")
            .select("*")
            .eq("id", createdAccount.id)
            .single();

        if (dbError) {
            console.error("LOG: DB Verify Error:", dbError);
            throw dbError;
        }
        assertEquals(dbAccount.name, newName);
        console.log("LOG: Update Verified in DB");

        // Cleanup (Optional, but good practice)
        await adminSupabase.auth.admin.deleteUser(user.user.id);
        console.log("LOG: Cleanup Complete");
    }
});
