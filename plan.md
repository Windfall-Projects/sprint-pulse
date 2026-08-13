1. **Analyze schema drift issues:**
   - I have discovered multiple `packages/shared/src/schemas/index.ts` models that are drifting from `packages/shared/src/database.types.ts`.
   - The most notable one to fix is `IntegrationMappingSchema`, which expects `project_id: z.string().uuid().nullable()` and does not have `created_at` or `updated_at`. The database expects `project_id: string` (not nullable) and does not have `created_at` or `updated_at` (Wait, actually database has `project_id` as non-nullable, but schema has it as nullable. Wait, let me check the DB schema for IntegrationMappingSchema. DB has `project_id: string`, no `created_at` or `updated_at`. No, actually schema has `created_at` and `updated_at` but DB doesn't? No, let me re-verify DB types vs schema).

Wait, earlier output of check_two.ts:
`Type '{ id: string; created_at: string; updated_at: string; team_id: string; project_id: string | null; is_active: boolean; integration_id: string; external_repo_id: string; }' is not assignable to type '{ id: string; integration_id: string; team_id: string; project_id: string; external_repo_id: string; is_active: boolean; }'`

DB Row Type for `integration_mappings`:
`{ id: string; integration_id: string; team_id: string; project_id: string; external_repo_id: string; is_active: boolean; }`
Zod Schema Inferred:
`{ id: string; integration_id: string; team_id: string; project_id: string | null; external_repo_id: string; is_active: boolean; created_at: string; updated_at: string; }`

So yes, Schema has extra `created_at` and `updated_at`, and `project_id` is nullable.

2. I will use the `message_user` tool to file a GitHub Issue according to the required template for `IntegrationMappingSchema`.
3. The issue will look like this:
   **File Path:** `packages/shared/src/schemas/index.ts`
   **Violated Boundary/Rule:** `Schema Alignment (Zod <-> Supabase): Ensure that every Zod schema defined in this workspace perfectly aligns with its corresponding Supabase database type (src/database.types.ts).`
   **Failing Code Snippet:**
   ```typescript
   export const IntegrationMappingSchema = z.object({
     id: z.string().uuid(),
     integration_id: z.string().uuid(),
     external_repo_id: z.string().min(1),
     team_id: z.string().uuid(),
     project_id: z.string().uuid().nullable(),
     is_active: z.boolean(),
     created_at: Timestamp,
     updated_at: Timestamp,
   });
   ```
   **Required Correction:** `Remove 'created_at' and 'updated_at' fields and remove '.nullable()' from 'project_id' in IntegrationMappingSchema to perfectly align with the database types.`

4. Then I will complete pre-commit steps by using `pre_commit_instructions` and then run `submit` and `initiate_memory_recording`.
