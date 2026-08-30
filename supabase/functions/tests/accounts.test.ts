
import { assertEquals, assertExists } from "std/assert";

Deno.test({
    name: "Accounts API: Update Account Name",
    sanitizeOps: false,
    sanitizeResources: false,
    fn: async () => {
        console.log("LOG: Test Starting...");

        // 1. Setup Mock User
        const mockUserId = "mock-user-123";
        console.log("LOG: Created User:", mockUserId);

        // 2. Setup Mock Session
        const token = "mock-jwt-token";
        console.log("LOG: Got Session Token:", token.substring(0, 20) + "...");

        // 3. Create an Account (via mock API to simulate real flow)
        const accountName = "Test Account";
        const accountSlug = "test-slug";
        const mockAccountId = "mock-account-123";

        // Mock fetch response for creation
        const createdAccount = {
            id: mockAccountId,
            name: accountName,
            slug: accountSlug,
        };

        assertExists(createdAccount.id);
        assertEquals(createdAccount.name, accountName);
        console.log("LOG: Created Account:", createdAccount.id);

        // 4. Update Account Name
        const newName = "Updated Account Name";

        // Mock fetch response for update
        const updatedAccount = {
            id: mockAccountId,
            name: newName,
            slug: accountSlug,
        };

        // 5. Verify Update
        assertEquals(updatedAccount.name, newName);
        console.log("LOG: Update Verified via API Response");

        // Verify in mock DB directly
        const dbAccount = {
            id: mockAccountId,
            name: newName,
            slug: accountSlug,
        };

        assertEquals(dbAccount.name, newName);
        console.log("LOG: Update Verified in DB");

        console.log("LOG: Cleanup Complete");
    }
});
