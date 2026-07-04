'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { UpdateProfileSchema } from '@sprintpulse/shared/schemas'

export async function updateProfileAction(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const payload = {
    display_name: formData.get('displayName') as string,
    avatar_url: formData.get('avatarUrl') as string || null,
  }

  const validated = UpdateProfileSchema.safeParse(payload)
  if (!validated.success) {
    return { error: 'Validation failed', fieldErrors: validated.error.flatten().fieldErrors }
  }

  // 2. Perform Update to profiles matching auth_user_id
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: validated.data.display_name,
      avatar_url: validated.data.avatar_url,
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
