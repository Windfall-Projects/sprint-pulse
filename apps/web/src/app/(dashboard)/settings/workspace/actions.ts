'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { UpdateAccountSchema } from '@sprintpulse/shared'

export async function updateWorkspaceName(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const accountId = formData.get('accountId') as string

  const payload = {
    name: formData.get('name')
  }

  const parsed = UpdateAccountSchema.safeParse(payload)

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // Double check authorization (must be admin/owner)
  const { data: membership } = await supabase
    .from('account_members')
    .select('role')
    .eq('account_id', accountId)
    .eq('user_id', user.id)
    .single()

  if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('accounts')
    .update({ name: parsed.data.name, updated_at: new Date().toISOString() })
    .eq('id', accountId)

  if (error) {
    console.error('Failed to update workspace name', error)
    return { error: 'Failed to update workspace.' }
  }

  revalidatePath('/dashboard', 'layout')
  return { success: 'Workspace updated successfully!' }
}

export async function updateMemberRole(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const accountId = formData.get('accountId') as string
  const targetUserId = formData.get('userId') as string
  const targetRole = formData.get('role') as string

  // Must be admin/owner to update roles
  const { data: membership } = await supabase
    .from('account_members')
    .select('role')
    .eq('account_id', accountId)
    .eq('user_id', user.id)
    .single()

  if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('account_members')
    .update({ role: targetRole })
    .eq('account_id', accountId)
    .eq('user_id', targetUserId)

  if (error) return { error: 'Failed' }

  revalidatePath('/settings/workspace')
  return { success: true }
}

export async function removeMember(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const accountId = formData.get('accountId') as string
  const targetUserId = formData.get('userId') as string

  // Must be admin/owner to remove
  const { data: membership } = await supabase
    .from('account_members')
    .select('role')
    .eq('account_id', accountId)
    .eq('user_id', user.id)
    .single()

  if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('account_members')
    .delete()
    .eq('account_id', accountId)
    .eq('user_id', targetUserId)

  if (error) return { error: 'Failed to remove member' }

  revalidatePath('/settings/workspace')
  return { success: true }
}
