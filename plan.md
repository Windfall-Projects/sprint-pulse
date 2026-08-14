1. **Report Architectural Violations via `message_user`**
   - Execute `message_user` to output two simulated GitHub issues based on violations found in `supabase/functions/api/routes/github.ts`:
     - **Issue 1:** The route `/webhook` does not use Zod for runtime validation on the incoming request payload (`c.req.json()`), violating the Runtime Shield rule.
     - **Issue 2:** The route `/webhook` manually types the DB payload `as any` rather than strictly aligning with the generated Supabase types, violating the Compile-Time Anchor rule.
2. **Complete Pre-Commit Steps**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
3. **Submit the Findings**
   - Execute the `submit` tool and concurrent tasks (`initiate_memory_recording`).
