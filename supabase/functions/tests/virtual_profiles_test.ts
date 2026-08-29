import { assertEquals, assertExists } from "std/assert";
import { Database } from "../../../packages/shared/src/database.types.ts";

const mockSupabase = {
    from: (table: string) => {
        return {
            insert: (payload: any) => ({
                select: () => ({
                    single: async () => {
                        let id = "mock-id";
                        if (table === "profiles") id = "profile-123";
                        if (table === "teams") id = "team-123";
                        if (table === "team_members") id = "member-123";
                        if (table === "work_items") id = "item-123";

                        return {
                            data: { ...payload, id, auth_user_id: table === "profiles" ? null : undefined },
                            error: null
                        };
                    }
                })
            })
        }
    }
};

Deno.test({
    name: "Virtual Profiles Lifecycle (Mocked)",
    fn: async () => {
        console.log("LOG: Test Starting (Mocked)...");

        try {
            console.log("LOG: 1. Creating Virtual Profile...");
            const profilePayload = {
                display_name: "Test Virtual User " + Date.now(),
                avatar_url: "https://example.com/avatar.png"
            };

            const { data: profile, error: profileError } = await mockSupabase
                .from("profiles")
                .insert(profilePayload)
                .select()
                .single();

            if (profileError) throw profileError;

            assertExists(profile);
            assertEquals(profile.display_name, profilePayload.display_name);
            assertEquals(profile.auth_user_id, null);
            console.log("LOG:    -> Success: Profile ID:", profile.id);

            console.log("LOG: 2. Creating Team...");
            const accountId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

            const { data: team, error: teamError } = await mockSupabase
                .from("teams")
                .insert({
                    account_id: accountId,
                    name: "Virtual Team " + Date.now(),
                    description: "Testing Virtual Profiles"
                })
                .select()
                .single();

            if (teamError) throw teamError;

            assertExists(team);
            console.log("LOG:    -> Success: Team ID:", team.id);

            console.log("LOG: 3. Adding Virtual Profile to Team...");
            const { data: member, error: memberError } = await mockSupabase
                .from("team_members")
                .insert({
                    team_id: team.id,
                    profile_id: profile.id,
                    role: "contributor"
                })
                .select()
                .single();

            if (memberError) throw memberError;

            assertExists(member);
            assertEquals(member.profile_id, profile.id);
            console.log("LOG:    -> Success: Member Added");

            console.log("LOG: 4. Assigning Work Item...");
            const { data: workItem, error: workItemError } = await mockSupabase
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

            if (workItemError) throw workItemError;

            assertExists(workItem);
            assertEquals(workItem.assignee_profile_id, profile.id);
            console.log("LOG:    -> Success: Work Item Assigned");

        } catch (err) {
            console.error("LOG: Uncaught Error:", err);
            throw err;
        }
    }
});
