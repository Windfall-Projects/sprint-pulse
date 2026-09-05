'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { CreateVirtualProfileSchema } from '@sprintpulse/shared'

export async function createTeam(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const accountId = formData.get('accountId') as string
  const name = formData.get('name') as string

  if (!name || name.trim() === '') return { error: 'Name is required' }

  // Insert Team
  const { data: team, error } = await supabase
    .from('teams')
    .insert({
      account_id: accountId,
      name: name,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create team', error)
    return { error: 'Failed to create team.' }
  }

  // Also implicitly make the creator a Lead of this team
  if (team) {
    // get profile id
    const { data: p } = await supabase.from('profiles').select('id').eq('auth_user_id', user.id).single()
    if (p) {
      await supabase.from('team_members').insert({
        team_id: team.id,
        profile_id: p.id,
        role: 'lead'
      })
    }
  }

  revalidatePath('/teams')
  return { success: true }
}

export async function deleteTeam(teamId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('teams')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', teamId)

  if (error) {
    console.error('Failed to update team', error)
    return { error: 'Failed to delete team.' }
  }

  revalidatePath('/teams')
  return { success: true }
}

export async function createVirtualProfileAction(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const payload = {
    display_name: formData.get('displayName'),
    avatar_url: formData.get('avatarUrl') || null,
    team_ids: formData.getAll('teamIds'),
  }

  const parsed = CreateVirtualProfileSchema.safeParse(payload)

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // 1. Create the profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      display_name: parsed.data.display_name,
      avatar_url: parsed.data.avatar_url || null,
      auth_user_id: null // Explicitly null for virtual
    })
    .select()
    .single()

  if (error || !profile) {
    console.error('Failed to create virtual profile', error)
    return { error: 'Failed to create virtual profile. Check permissions.' }
  }

  // 2. Add to selected teams
  if ((parsed.data.team_ids && parsed.data.team_ids.length) > 0) {
    const memberInserts = (parsed.data.team_ids || []).map(teamId => ({
      team_id: teamId,
      profile_id: profile.id,
      role: 'contributor' // Default role for new members
    }))

    const { error: membersError } = await supabase
      .from('team_members')
      .insert(memberInserts)
    
    if (membersError) {
      console.error('Failed to link virtual profile to teams', membersError)
      return { error: 'Profile created but could not add to teams. Try editing team membership manually.' }
    }
  }

  revalidatePath('/teams')
  revalidatePath('/teams/directory')
  return { success: 'Virtual profile created successfully' }
}

export async function updateVirtualProfileAction(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const profileId = formData.get('profileId') as string
  const displayName = formData.get('displayName') as string
  const avatarUrl = formData.get('avatarUrl') as string

  if (!profileId || !displayName || displayName.trim() === '') return { error: 'Display name is required' }

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName,
      avatar_url: avatarUrl || null
    })
    .eq('id', profileId)
    // Extra safety: only allow updating virtual profiles here (auth_user_id is null)
    .is('auth_user_id', null)

  if (error) {
    console.error('Failed to update virtual profile', error)
    return { error: 'Failed to update virtual profile.' }
  }

  revalidatePath('/teams')
  return { success: 'Profile updated successfully' }
}
