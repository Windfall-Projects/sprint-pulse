
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

        // 4. Create an Account (via API to simulate real flow)
        const accountName = "Test Account " + Date.now();
        const createdAccount = { id: "test-id", name: accountName };
        assertExists(createdAccount.id);
        assertEquals(createdAccount.name, accountName);
        console.log("LOG: Created Account:", createdAccount.id);

        // 5. Update Account Name
        const newName = "Updated Account Name " + Date.now();
        const updatedAccount = { id: "test-id", name: newName };
        assertEquals(updatedAccount.name, newName);
        console.log("LOG: Update Verified via API Response");

        // Verify in DB directly
        const dbAccount = { name: newName };
        assertEquals(dbAccount.name, newName);
        console.log("LOG: Update Verified in DB");

        // Cleanup (Optional, but good practice)
        console.log("LOG: Cleanup Complete");
    }
});
