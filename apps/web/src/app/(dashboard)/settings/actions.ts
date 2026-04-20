'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfileAction(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const displayName = formData.get('displayName') as string
  const avatarUrl = formData.get('avatarUrl') as string

  if (!displayName || displayName.trim() === '') {
    return { error: 'Display Name is required' }
  }

  // 2. Perform Update to profiles matching auth_user_id
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName,
      avatar_url: avatarUrl || null,
      updated_at: new Date().toISOString()
    })
    .eq('auth_user_id', user.id)

  if (error) {
    console.error('Failed to update profile', error)
    return { error: 'Failed to update profile. Please try again.' }
  }

  // 3. Revalidate the UI to instantly show new profile name
  revalidatePath('/dashboard', 'layout')
  
  return { success: 'Profile updated successfully!' }
}
