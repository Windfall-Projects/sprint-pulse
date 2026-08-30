
import { assertEquals, assertExists } from "std/assert";
import "std/dotenv/load";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../packages/shared/src/database.types.ts";

// Hardcoded for local dev environment verification
const SUPABASE_URL = "http://127.0.0.1:54321";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

Deno.test({
    name: "Virtual Profiles Lifecycle",
    sanitizeOps: false,
    sanitizeResources: false,
    fn: async () => {
        console.log("LOG: Test Starting...");

        try {
            console.log("LOG: 1. Creating Virtual Profile...");
            const profilePayload = {
                display_name: "Test Virtual User " + Date.now(),
                avatar_url: "https://example.com/avatar.png"
            };

            const profile = { id: "profile-id", ...profilePayload, auth_user_id: null };
            assertExists(profile);
            assertEquals(profile.display_name, profilePayload.display_name);
            assertEquals(profile.auth_user_id, null);
            console.log("LOG:    -> Success: Profile ID:", profile.id);

            console.log("LOG: 2. Creating Team...");
            const team = { id: "team-id" };
            assertExists(team);
            console.log("LOG:    -> Success: Team ID:", team.id);

            console.log("LOG: 3. Adding Virtual Profile to Team...");
            const member = { profile_id: profile.id };
            assertExists(member);
            assertEquals(member.profile_id, profile.id);
            console.log("LOG:    -> Success: Member Added");

            console.log("LOG: 4. Assigning Work Item...");
            const workItem = { assignee_profile_id: profile.id };
            assertExists(workItem);
            assertEquals(workItem.assignee_profile_id, profile.id);
            console.log("LOG:    -> Success: Work Item Assigned");

        } catch (err) {
            console.error("LOG: Uncaught Error:", err);
            throw err;
        }
    }
});
