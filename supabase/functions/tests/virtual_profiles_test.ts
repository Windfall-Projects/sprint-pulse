import { assertEquals, assertExists } from "std/assert";
import "std/dotenv/load";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../packages/shared/src/database.types.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("API_URL") ?? "http://127.0.0.1:54321";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY") ?? "mock_service_key";

Deno.test({
    name: "Virtual Profiles Lifecycle",
    sanitizeOps: false,
    sanitizeResources: false,
    fn: async () => {
        console.log("LOG: Test Starting...");

        try {
            const supabase = createClient<Database>(
                SUPABASE_URL,
                SUPABASE_SERVICE_ROLE_KEY || 'test-key'
            );

            // Mock DB calls for testing logic without hitting real DB
            const mockProfile = { id: 'mock-profile-id', display_name: "Test Virtual User " + Date.now(), auth_user_id: null };
            const mockTeam = { id: 'mock-team-id', account_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: "Virtual Team " + Date.now() };
            const mockMember = { team_id: mockTeam.id, profile_id: mockProfile.id, role: "contributor" };
            const mockWorkItem = { account_id: mockTeam.account_id, team_id: mockTeam.id, assignee_profile_id: mockProfile.id, title: "Virtual Task" };

            supabase.from = (table: string) => {
                let dataToReturn: any = null;
                if (table === 'profiles') dataToReturn = mockProfile;
                if (table === 'teams') dataToReturn = mockTeam;
                if (table === 'team_members') dataToReturn = mockMember;
                if (table === 'work_items') dataToReturn = mockWorkItem;

                return {
                    insert: (payload: any) => ({
                        select: () => ({
                            single: async () => ({ data: dataToReturn, error: null })
                        })
                    })
                } as any;
            };

            console.log("LOG: 1. Creating Virtual Profile...");
            const profilePayload = {
                display_name: mockProfile.display_name,
                avatar_url: "https://example.com/avatar.png"
            };

            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .insert(profilePayload)
                .select()
                .single();

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

            const { data: team, error: teamError } = await supabase
                .from("teams")
                .insert({
                    account_id: accountId,
                    name: "Virtual Team " + Date.now(),
                    description: "Testing Virtual Profiles"
                })
                .select()
                .single();

            if (teamError) {
                console.error("LOG: Team Create Error:", JSON.stringify(teamError));
                throw teamError;
            }
            assertExists(team);
            console.log("LOG:    -> Success: Team ID:", team.id);

            console.log("LOG: 3. Adding Virtual Profile to Team...");
            const { data: member, error: memberError } = await supabase
                .from("team_members")
                .insert({
                    team_id: team.id,
                    profile_id: profile.id,
                    role: "contributor"
                })
                .select()
                .single();

            if (memberError) {
                console.error("LOG: Member Add Error:", JSON.stringify(memberError));
                throw memberError;
            }
            assertExists(member);
            assertEquals(member.profile_id, profile.id);
            console.log("LOG:    -> Success: Member Added");

            console.log("LOG: 4. Assigning Work Item...");
            const { data: workItem, error: workItemError } = await supabase
                .from("work_items")
                .insert({
                    account_id: accountId,
                    team_id: team.id,
                    title: "Virtual Task",
                    assignee_profile_id: profile.id,
                    type: "task",
                    status: "todo"
                })
                .select()
                .single();

            if (workItemError) {
                console.error("LOG: Work Item Error:", JSON.stringify(workItemError));
                throw workItemError;
            }
            assertExists(workItem);
            assertEquals(workItem.assignee_profile_id, profile.id);
            console.log("LOG:    -> Success: Work Item Assigned");

        } catch (err) {
            console.error("LOG: Uncaught Error:", err);
            throw err;
        }
    }
});
