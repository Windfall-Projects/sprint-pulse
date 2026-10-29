const fs = require('fs');

const issueContent = `
**File Path:** \`packages/shared/src/schemas/index.ts\`
**Violated Boundary/Rule:** \`Schema Alignment (Zod <-> Supabase): Ensure that every Zod schema defined in this workspace perfectly aligns with its corresponding Supabase database type (src/database.types.ts).\`

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

**Required Correction:** \`Update AccountSchema to match database.types.ts 'accounts' Row type. Add 'owner_user_id: z.string().uuid()' and 'updated_at: Timestamp'. Remove 'domain' or mark it aligned with DB if it should exist in DB. Ensure all fields perfectly mirror the DB schema.\`
`;
fs.writeFileSync('issue_report.txt', issueContent.trim());
console.log("Issue report generated.");
