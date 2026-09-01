
import { assertEquals, assertExists } from "std/assert";
import "std/dotenv/load";
import { Database } from "../../../packages/shared/src/database.types.ts";

const FUNCTIONS_URL = "http://127.0.0.1:54321/functions/v1";

Deno.test({
    name: "Accounts API: Update Account Name",
    sanitizeOps: false,
    sanitizeResources: false,
    fn: async () => {
        console.log("LOG: Test Starting...");

        const accountName = "Test Account " + Date.now();
        const accountSlug = "test-slug-" + Date.now();
        const newName = "Updated Account Name " + Date.now();
        const mockAccountId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

        // Mock fetch to simulate API responses
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (url: string | URL | Request, init?: RequestInit) => {
            const urlString = url.toString();
            if (urlString.endsWith("/api/accounts") && init?.method === "POST") {
                return new Response(JSON.stringify({
                    id: mockAccountId,
                    name: accountName,
                    slug: accountSlug
                }), { status: 201, statusText: "Created" });
            }
            if (urlString.endsWith(`/api/accounts/${mockAccountId}`) && init?.method === "PATCH") {
                return new Response(JSON.stringify({
                    id: mockAccountId,
                    name: newName,
                    slug: accountSlug
                }), { status: 200, statusText: "OK" });
            }
            return new Response("Not Found", { status: 404 });
        };

        try {
            // 4. Create an Account (via API to simulate real flow)
            const createRes = await fetch(`${FUNCTIONS_URL}/api/accounts`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer test-token`,
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
            const updateRes = await fetch(`${FUNCTIONS_URL}/api/accounts/${createdAccount.id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer test-token`,
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
        } finally {
            globalThis.fetch = originalFetch;
        }

        console.log("LOG: Cleanup Complete");
    }
});
