const fs = require('fs');
const issues = [];
function addIssue(schema, fieldList, reqMsg) {
  const content = `**File Path:** \`packages/shared/src/schemas/index.ts\`
**Violated Boundary/Rule:** \`Schema Alignment (Zod <-> Supabase): Ensure that every Zod schema defined in this workspace perfectly aligns with its corresponding Supabase database type (src/database.types.ts).\`

**Failing Code Snippet:**
\`\`\`typescript
${schema}
\`\`\`

**Required Correction:** \`${reqMsg}\``;
  issues.push(content);
}

// Generate the issue report with all the mismatches.
const fullReport = `**File Path:** \`packages/shared/src/schemas/index.ts\`
**Violated Boundary/Rule:** \`Schema Alignment (Zod <-> Supabase): Ensure that every Zod schema defined in this workspace perfectly aligns with its corresponding Supabase database type (src/database.types.ts). Flag any Zod schema where the inferred type (z.infer) drifts from or contradicts the generated database contract.\`

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

**Required Correction:** \`Update AccountSchema to match database.types.ts 'accounts' Row type. Add 'owner_user_id: z.string().uuid()' and 'updated_at: Timestamp'. Remove 'domain' as it is not present in the DB schema.\``;

fs.writeFileSync('issue_report.txt', fullReport);
console.log("Issue report generated.");
