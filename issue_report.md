**File Path:** `apps/web/src/app/(dashboard)/pulse/CreateSurveyModal.tsx`
**Violated Boundary/Rule:** `The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.`

**Failing Code Snippet:**
```typescript
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    formData.append('teamId', teamId)
    formData.append('accountId', accountId)

    // We will hardcode a basic question for the MVP
    await createSurvey(formData)

    setIsPending(false)
    setIsOpen(false)
  }
```

**Required Correction:** `Import and apply the corresponding Zod schema from @sprintpulse/shared to validate the form data before calling createSurvey.`

---
**File Path:** `apps/web/src/app/(dashboard)/backlog/CreateWorkItemModal.tsx`
**Violated Boundary/Rule:** `The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.`

**Failing Code Snippet:**
```typescript
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    formData.append('teamId', teamId)
    formData.append('accountId', accountId)
    await createWorkItem(formData)
    setIsPending(false)
    setIsOpen(false)
  }
```

**Required Correction:** `Import and apply the corresponding Zod schema from @sprintpulse/shared to validate the form data before calling createWorkItem.`

---
**File Path:** `apps/web/src/app/(dashboard)/projects/CreateProjectModal.tsx`
**Violated Boundary/Rule:** `The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.`

**Failing Code Snippet:**
```typescript
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !teamId) return

    setIsPending(true)
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('teamId', teamId)

    await createProject(formData)

    setIsPending(false)
    setIsOpen(false)
    setName('')
    setDescription('')
  }
```

**Required Correction:** `Import and apply the corresponding Zod schema from @sprintpulse/shared to validate the form data before calling createProject.`

---
**File Path:** `apps/web/src/app/(dashboard)/sprints/CreateSprintModal.tsx`
**Violated Boundary/Rule:** `The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.`

**Failing Code Snippet:**
```typescript
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    formData.append('teamId', teamId)
    await createSprint(formData)
    setIsPending(false)
    setIsOpen(false)
  }
```

**Required Correction:** `Import and apply the corresponding Zod schema from @sprintpulse/shared to validate the form data before calling createSprint.`

---
**File Path:** `apps/web/src/app/(dashboard)/kudos/CreateKudosModal.tsx`
**Violated Boundary/Rule:** `The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.`

**Failing Code Snippet:**
```typescript
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    formData.append('teamId', teamId)
    formData.append('accountId', accountId)
    formData.append('senderProfileId', currentUserProfileId)

    await createKudos(formData)
    setIsPending(false)
    setIsOpen(false)
  }
```

**Required Correction:** `Import and apply the corresponding Zod schema from @sprintpulse/shared to validate the form data before calling createKudos.`

---
**File Path:** `apps/web/src/app/(dashboard)/teams/CreateTeamModal.tsx`
**Violated Boundary/Rule:** `The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.`

**Failing Code Snippet:**
```typescript
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setIsPending(true)
    const formData = new FormData()
    formData.append('accountId', accountId)
    formData.append('name', name)

    await createTeam(formData)

    setIsPending(false)
    setIsOpen(false)
    setName('')
  }
```

**Required Correction:** `Import and apply the corresponding Zod schema from @sprintpulse/shared to validate the form data before calling createTeam.`

---
**File Path:** `apps/web/src/app/(dashboard)/settings/workspace/WorkspaceSettingsForm.tsx`
**Violated Boundary/Rule:** `The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.`

**Failing Code Snippet:**
```typescript
  async function handleAction(e: React.FormEvent) {
    e.preventDefault()
    if (!canEdit) return

    setIsPending(true)
    setMessage('')

    const formData = new FormData()
    formData.append('accountId', accountId)
    formData.append('name', name)

    const result = await updateWorkspaceName(formData)

    if (result.error) {
      setMessage(`Error: ${result.error}`)
    } else if (result.success) {
      setMessage(`Success: ${result.success}`)
    }

    setIsPending(false)
  }
```

**Required Correction:** `Import and apply the corresponding Zod schema from @sprintpulse/shared to validate the form data before calling updateWorkspaceName.`

---
**File Path:** `apps/web/src/app/(dashboard)/teams/directory/CreateVirtualProfileModal.tsx`
**Violated Boundary/Rule:** `The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.`

**Failing Code Snippet:**
```typescript
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim()) return

    setIsPending(true)
    setErrorStatus(null)

    const formData = new FormData()
    formData.append('displayName', displayName)
    if (avatarUrl) formData.append('avatarUrl', avatarUrl)

    selectedTeams.forEach(teamId => {
      formData.append('teamIds', teamId)
    })

    const result = await createVirtualProfileAction(null, formData)

    if (result.error) {
      setErrorStatus(result.error)
      setIsPending(false)
    } else {
      setIsPending(false)
      setIsOpen(false)
      setDisplayName('')
      setAvatarUrl('')
      setSelectedTeams([])
    }
  }
```

**Required Correction:** `Import and apply the corresponding Zod schema from @sprintpulse/shared to validate the form data before calling createVirtualProfileAction.`

---
**File Path:** `apps/web/src/app/(dashboard)/teams/directory/EditVirtualProfileModal.tsx`
**Violated Boundary/Rule:** `The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.`

**Failing Code Snippet:**
```typescript
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim()) return

    setIsPending(true)
    setErrorStatus(null)

    const formData = new FormData()
    formData.append('profileId', profile.id)
    formData.append('displayName', displayName)
    if (avatarUrl) formData.append('avatarUrl', avatarUrl)

    const result = await updateVirtualProfileAction(null, formData)

    if (result.error) {
      setErrorStatus(result.error)
      setIsPending(false)
    } else {
      setIsPending(false)
      setIsOpen(false)
    }
  }
```

**Required Correction:** `Import and apply the corresponding Zod schema from @sprintpulse/shared to validate the form data before calling updateVirtualProfileAction.`

---
**File Path:** `apps/web/src/app/(auth)/signup/SignupForm.tsx`
**Violated Boundary/Rule:** `The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.`

**Failing Code Snippet:**
```typescript
  const [state, formAction, isPending] = useActionState(signupAction, initialState)

  return (
    <Card className="w-full relative overflow-hidden" glass>
      <form action={formAction} className="space-y-6">
```

**Required Correction:** `Import and apply the corresponding Zod schema from @sprintpulse/shared to validate the form data client-side before submission.`

---
**File Path:** `apps/web/src/app/(auth)/login/LoginForm.tsx`
**Violated Boundary/Rule:** `The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.`

**Failing Code Snippet:**
```typescript
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <Card className="w-full relative overflow-hidden" glass>
      <form action={formAction} className="space-y-6">
```

**Required Correction:** `Import and apply the corresponding Zod schema from @sprintpulse/shared to validate the form data client-side before submission.`

---
**File Path:** `apps/web/src/app/onboarding/OnboardingForm.tsx`
**Violated Boundary/Rule:** `The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.`

**Failing Code Snippet:**
```typescript
  const [state, formAction, isPending] = useActionState(createWorkspaceAction, initialState)

  return (
    <Card className="w-full relative overflow-hidden" glass>
      <form action={formAction} className="space-y-6">
```

**Required Correction:** `Import and apply the corresponding Zod schema from @sprintpulse/shared to validate the form data client-side before submission.`

---
**File Path:** `apps/web/src/app/(dashboard)/settings/ProfileForm.tsx`
**Violated Boundary/Rule:** `The Runtime Shield (Zod): Enforce that all client-side form submissions and data payloads sent to the API are validated using Zod schemas imported from the @sprintpulse shared workspace. Flag any hardcoded or local validation logic that bypasses the shared schemas.`

**Failing Code Snippet:**
```typescript
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState)

  return (
    <Card glass className="max-w-2xl">
      <div className="flex items-center space-x-3 mb-6 border-b border-border pb-4">
        <UserCircleIcon className="w-8 h-8 text-primary" />
        <h2 className="text-xl font-semibold">Public Profile</h2>
      </div>

      <form action={formAction} className="space-y-6">
```

**Required Correction:** `Import and apply the corresponding Zod schema from @sprintpulse/shared to validate the form data client-side before submission.`
