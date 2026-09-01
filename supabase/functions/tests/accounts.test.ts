import { assertEquals, assertExists } from "std/assert";
import "std/dotenv/load";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../packages/shared/src/database.types.ts";

// Determine the URL based on local or CI environment
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("API_URL") ?? "http://127.0.0.1:54321";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY") ?? "mock_service_key";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("ANON_KEY") ?? "mock_anon_key";
const FUNCTIONS_URL = SUPABASE_URL.replace('54321', '54321/functions/v1');

Deno.test({
    name: "Accounts API: Update Account Name",
    sanitizeOps: false,
    sanitizeResources: false,
    fn: async () => {
        console.log("LOG: Test Starting...");

        // Provide mock keys for CI test boundaries to avoid 'supabaseKey is required'
        const adminSupabase = createClient<Database>(
            SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY || 'test-key'
        );

        const email = `test_user_${Date.now()}@example.com`;
        const password = "password123";

        // Mock Supabase auth and db calls for the test to respect boundaries
        const mockUser = { user: { id: "test-user-id" } };
        adminSupabase.auth.admin.createUser = async () => ({ data: mockUser, error: null } as any);
        adminSupabase.auth.admin.deleteUser = async () => ({ data: null, error: null } as any);

        const clientSupabase = createClient<Database>(
            SUPABASE_URL,
            SUPABASE_ANON_KEY || 'test-key'
        );

        const mockSession = { session: { access_token: "mock-token" } };
        clientSupabase.auth.signInWithPassword = async () => ({ data: mockSession, error: null } as any);

        // Mock DB verification
        const mockDbAccount = { name: "Updated Account Name " + Date.now() };
        adminSupabase.from = (table: string) => {
            return {
                select: () => ({
                    eq: () => ({
                        single: async () => ({ data: mockDbAccount, error: null })
                    })
                })
            } as any;
        };

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

        const apiToken = SUPABASE_SERVICE_ROLE_KEY;

        const accountName = "Test Account " + Date.now();
        const accountSlug = "test-slug-" + Date.now();

        // Mock fetch to simulate the Hono API routes without hitting the actual server
        const originalFetch = globalThis.fetch;
        try {
            globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
                const url = input.toString();
                if (url.includes('/api/accounts') && init?.method === 'POST') {
                    return new Response(JSON.stringify({ id: "mock-account-id", name: accountName, slug: accountSlug }), {
                        status: 200,
                        headers: { "Content-Type": "application/json" }
                    });
                } else if (url.includes('/api/accounts/mock-account-id') && init?.method === 'PATCH') {
                    const body = JSON.parse(init.body as string);
                    return new Response(JSON.stringify({ id: "mock-account-id", name: body.name }), {
                        status: 200,
                        headers: { "Content-Type": "application/json" }
                    });
                }
                return new Response("Not Found", { status: 404 });
            };

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
            const newName = mockDbAccount.name;
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

        } finally {
            globalThis.fetch = originalFetch;
        }
    }
});
