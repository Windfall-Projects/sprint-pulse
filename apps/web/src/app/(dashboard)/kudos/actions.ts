'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { GiveKudosSchema } from '@sprintpulse/shared/schemas'

export async function createKudos(formData: FormData) {
  const supabase = await createClient()

  const accountId = formData.get('accountId') as string
  const senderProfileId = formData.get('senderProfileId') as string

  const payload = {
    team_id: formData.get('teamId') as string,
    receiver_profile_id: formData.get('receiverProfileId') as string,
    category: formData.get('category') as string || null,
    message: formData.get('message') as string,
    sprint_id: formData.get('sprintId') as string || null
  }

  const validated = GiveKudosSchema.safeParse(payload)
  if (!validated.success) {
    return { error: 'Validation failed', fieldErrors: validated.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from('kudos')
    .insert({
      account_id: accountId,
      sender_profile_id: senderProfileId,
      ...validated.data
    })

  if (error) {
    console.error('Failed to create kudos', error)
    return { error: 'Failed' }
  }

  revalidatePath('/kudos')
  return { success: true }
}

export async function deleteKudos(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('kudos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete kudos', error)
    return { error: 'Failed' }
  }

  revalidatePath('/kudos')
  return { success: true }
}
