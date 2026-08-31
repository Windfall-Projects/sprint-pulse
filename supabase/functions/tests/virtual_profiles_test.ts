
import { assertEquals, assertExists } from "std/assert";
import "std/dotenv/load";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../packages/shared/src/database.types.ts";

// Hardcoded for local dev environment verification
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("API_URL") ?? "http://127.0.0.1:54321";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY") ?? "";

Deno.test({
    name: "Virtual Profiles Lifecycle",
    sanitizeOps: false,
    sanitizeResources: false,
    fn: async () => {
        console.log("LOG: Test Starting...");

        try {
            const supabase = createClient<Database>(
                SUPABASE_URL,
                SUPABASE_SERVICE_ROLE_KEY
            );

            console.log("LOG: 1. Creating Virtual Profile...");
            const profilePayload = {
                display_name: "Test Virtual User " + Date.now(),
                avatar_url: "https://example.com/avatar.png"
            };

            const { data: profileList, error: profileError } = await supabase
                .from("profiles")
                .insert(profilePayload)
                .select();

            const profile = Array.isArray(profileList) ? profileList[0] : profileList;

            if (profileError) {
                console.error("LOG: Profile Create Error:", JSON.stringify(profileError));
                throw profileError;
            }
            assertExists(profile);
            assertEquals(profile.display_name, profilePayload.display_name);
            assertEquals(profile.auth_user_id, null);
            console.log("LOG:    -> Success: Profile ID:", profile.id);

            console.log("LOG: 2. Creating Team...");
            const accountId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

            const { data: teamList, error: teamError } = await supabase
                .from("teams")
                .insert({
                    account_id: accountId,
                    name: "Virtual Team " + Date.now(),
                    description: "Testing Virtual Profiles"
                })
                .select();

            if (teamError) {
                console.error("LOG: Team Create Error:", JSON.stringify(teamError));
                throw teamError;
            }
            const team = Array.isArray(teamList) ? teamList[0] : teamList;
            assertExists(team);
            if (!team || !('id' in team)) throw new Error("Missing team ID");
            console.log("LOG:    -> Success: Team ID:", team.id);

            console.log("LOG: 3. Adding Virtual Profile to Team...");
            const { data: memberList, error: memberError } = await supabase
                .from("team_members")
                .insert({
                    team_id: team.id as string,
                    profile_id: profile!.id as string,
                    role: "contributor"
                })
                .select();

            if (memberError) {
                console.error("LOG: Member Add Error:", JSON.stringify(memberError));
                throw memberError;
            }
            const member = Array.isArray(memberList) ? memberList[0] : memberList;
            assertExists(member);
            assertEquals((member as any).profile_id, profile!.id);
            console.log("LOG:    -> Success: Member Added");

            console.log("LOG: 4. Assigning Work Item...");
            const { data: workItemList, error: workItemError } = await supabase
                .from("work_items")
                .insert({
                    account_id: accountId,
                    team_id: team.id as string,
                    title: "Virtual Task",
                    assignee_profile_id: profile!.id as string,
                    type: "task",
                    status: "todo",
                    provider: "native"
                })
                .select();

            if (workItemError) {
                console.error("LOG: Work Item Error:", JSON.stringify(workItemError));
                throw workItemError;
            }
            const workItem = Array.isArray(workItemList) ? workItemList[0] : workItemList;
            assertExists(workItem);
            assertEquals((workItem as any).assignee_profile_id, profile!.id);
            console.log("LOG:    -> Success: Work Item Assigned");

        } catch (err) {
            console.error("LOG: Uncaught Error:", err);
            throw err;
        }
    }
});
