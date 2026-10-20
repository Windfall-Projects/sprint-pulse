import * as fs from "fs";

const issueMarkdown = `**File Path:** \`packages/shared/src/schemas/index.ts\`
**Violated Boundary/Rule:** \`Schema Alignment (Zod <-> Supabase)\`

**Failing Code Snippet:**
\`\`\`typescript
export const AccountSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  domain: z.string().nullable(),
  is_test_tenant: z.boolean(),
  created_at: Timestamp,
});
\`\`\`

**Required Correction:** \`Update AccountSchema to match the accounts table schema by adding owner_user_id and updated_at, and removing domain.\`

---
**File Path:** \`packages/shared/src/schemas/index.ts\`
**Violated Boundary/Rule:** \`Schema Alignment (Zod <-> Supabase)\`

**Failing Code Snippet:**
\`\`\`typescript
export const TeamSchema = z.object({
  id: z.string().uuid(),
  account_id: z.string().uuid(),
  name: z.string().min(1, "Team name is required"),
  deleted_at: Timestamp.nullable(), // Soft Delete support
  created_at: Timestamp,
  updated_at: Timestamp,
});
\`\`\`

**Required Correction:** \`Update TeamSchema to match the teams table schema by adding description.\`

---
**File Path:** \`packages/shared/src/schemas/index.ts\`
**Violated Boundary/Rule:** \`Schema Alignment (Zod <-> Supabase)\`

**Failing Code Snippet:**
\`\`\`typescript
export const SprintSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  name: z.string().min(1, "Sprint name is required"),
  start_date: DateString,
  end_date: DateString,
  goal: z.string().nullable(),
  status: SprintStatusEnum,
  created_at: Timestamp,
  updated_at: Timestamp,
});
\`\`\`

**Required Correction:** \`Update SprintSchema to match the sprints table schema by adding account_id.\`

---
**File Path:** \`packages/shared/src/schemas/index.ts\`
**Violated Boundary/Rule:** \`Schema Alignment (Zod <-> Supabase)\`

**Failing Code Snippet:**
\`\`\`typescript
export const WorkItemSchema = z.object({
  // ...
  status: WorkItemStatusEnum,
  type: WorkItemTypeEnum,

  // External Integration ("Shadow Records")
  provider: WorkItemProviderEnum,
// ...
\`\`\`

**Required Correction:** \`Update WorkItemSchema to match the work_items table schema by ensuring type matching for status, type, and provider (they are strings in db, need to be aligned).\`
`;

fs.writeFileSync("all_reports.md", issueMarkdown);
