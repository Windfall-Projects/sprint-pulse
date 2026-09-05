'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { UpdateProfileSchema } from '@sprintpulse/shared'

export async function updateProfileAction(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const payload = {
    display_name: formData.get('displayName'),
    avatar_url: formData.get('avatarUrl') || null,
  }

  const parsed = UpdateProfileSchema.safeParse(payload)

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // 2. Perform Update to profiles matching auth_user_id
  const { error } = await supabase
    .from('profiles')
    .update({
      ...parsed.data,
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
