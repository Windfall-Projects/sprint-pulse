**File Path:** `apps/web/src/app/(dashboard)/projects/actions.ts`
**Violated Boundary/Rule:** `The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.`

**Failing Code Snippet:**
```typescript
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const teamId = formData.get('teamId') as string

  if (!name || name.trim() === '') return { error: 'Name is required' }
  if (!teamId) return { error: 'Team is required' }
```

**Required Correction:** `Import and apply the corresponding Zod schema from @sprintpulse/shared`

---

**File Path:** `apps/web/src/app/(dashboard)/projects/CreateProjectModal.tsx`
**Violated Boundary/Rule:** `The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.`

**Failing Code Snippet:**
```typescript
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !teamId) return

    setIsPending(true)
```

**Required Correction:** `Import and apply the corresponding Zod schema from @sprintpulse/shared`

---

**File Path:** `apps/web/src/app/page.tsx`
**Violated Boundary/Rule:** `Next.js Seams: Enforce the strict boundary between React Server Components (RSC) and Client Components ("use client"). Flag any unnecessary client-side rendering or leaking of server secrets into client bundles.`

**Failing Code Snippet:**
```typescript
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
```

**Required Correction:** `Refactor the page to be a React Server Component by isolating client-side interactivity (like framer-motion and routing) into smaller dedicated Client Components.`

---

**File Path:** `apps/web/test-db.js`
**Violated Boundary/Rule:** `Test Boundaries: Analyze UI test suites for proper isolation. Frontend unit tests must fully mock network requests and database layers. Flag tests that attempt real network calls.`

**Failing Code Snippet:**
```javascript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseKey) {
  console.log('No supabase key found')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
```

**Required Correction:** `Mock the Supabase client and network requests to ensure pure unit test isolation without requiring a live database connection.`