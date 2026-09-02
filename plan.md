1.  **Objective**: I am acting as the Automated Architectural Sentinel for the `apps/web` Next.js frontend.
2.  **Violation**: The Runtime Shield (Zod) rule states: "all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the `@sprintpulse` shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas."
3.  **Files with Violations**:
    *   `apps/web/src/app/(dashboard)/settings/workspace/WorkspaceSettingsForm.tsx` (using local validation in `handleAction`)
    *   `apps/web/src/app/(dashboard)/pulse/CreateSurveyModal.tsx` (using hardcoded input validation)
    *   `apps/web/src/app/(dashboard)/projects/CreateProjectModal.tsx`
    *   `apps/web/src/app/(dashboard)/backlog/CreateWorkItemModal.tsx`
    *   `apps/web/src/app/(dashboard)/teams/directory/CreateVirtualProfileModal.tsx`
    *   `apps/web/src/app/(dashboard)/teams/directory/EditVirtualProfileModal.tsx`
    *   `apps/web/src/app/(dashboard)/teams/CreateTeamModal.tsx`
    *   `apps/web/src/app/(dashboard)/sprints/CreateSprintModal.tsx`
    *   `apps/web/src/app/(dashboard)/kudos/CreateKudosModal.tsx`
4.  **Task**: I will pick one violation (e.g., `apps/web/src/app/(dashboard)/settings/workspace/WorkspaceSettingsForm.tsx`), ensure no existing issue for it, and report it using `message_user`. Since `gh` is unavailable, I'll output it directly via `message_user`.
5.  **Tests**: I must include the required test execution step: `SUPABASE_URL=http://127.0.0.1:54321 SUPABASE_SERVICE_ROLE_KEY=testkey SUPABASE_ANON_KEY=testkey pnpm test` right before the pre-commit stage.
