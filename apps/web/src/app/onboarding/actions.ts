'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CreateAccountSchema } from '@sprintpulse/shared/schemas'

export async function createWorkspaceAction(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const workspaceName = formData.get('workspaceName') as string

  const slug = workspaceName ? workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000) : ''
  const validated = CreateAccountSchema.safeParse({ name: workspaceName, slug })
  if (!validated.success) {
    return { error: 'Validation failed', fieldErrors: validated.error.flatten().fieldErrors }
  }

  // 1. Get user and profile
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) {
    return { error: 'Your profile seems to be missing. Please contact support.' }
  }

  // 2. Pre-generate the account UUID so we don't need .select().
  // Using .select() immediately after insert fails because RLS SELECT policies
  // require an account_member record that hasn't been created yet.
  const accountId = crypto.randomUUID()

  // 3. Create the Account (Workspace)
  const { error: accountError } = await supabase
    .from('accounts')
    .insert({
      id: accountId,
      name: workspaceName,
      slug,
      owner_user_id: user.id,
    })

  if (accountError) {
    console.error('Account creation error', accountError)
    return { error: 'Failed to create workspace' }
  }

  // 4. Add user as owner in account_members (using Auth user ID per db schema)
  const { error: memberError } = await supabase
    .from('account_members')
    .insert({
      account_id: accountId,
      user_id: user.id,
      role: 'owner',
    })

  if (memberError) {
    console.error('Account member error', memberError)
    return { error: 'Failed to assign owner to workspace' }
  }

  // 5. Create the default "General" team
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({
      account_id: accountId,
      name: 'General',
    })
    .select()
    .single()

  if (team && !teamError) {
    // 6. Add user to the default team (using Profile ID per migration rules)
    await supabase.from('team_members').insert({
      team_id: team.id,
      profile_id: profile.id,
      role: 'lead',
    })
  } else {
      console.error("Team Creation Error", teamError)
  }

  redirect('/dashboard')
}
