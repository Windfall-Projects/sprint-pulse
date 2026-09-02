'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { GiveKudosSchema } from '@sprintpulse/shared'

export async function createKudos(formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    team_id: formData.get('teamId'),
    receiver_profile_id: formData.get('receiverProfileId'),
    category: formData.get('category'),
    message: formData.get('message'),
    sprint_id: formData.get('sprintId') || null,
  }

  const result = GiveKudosSchema.safeParse(rawData)

  if (!result.success) {
    return { error: 'Required fields missing or invalid' }
  }

  const accountId = formData.get('accountId') as string
  const senderProfileId = formData.get('senderProfileId') as string

  if (!accountId || !senderProfileId) {
     return { error: 'Required auth context missing' }
  }

  const { error } = await supabase
    .from('kudos')
    .insert({
      account_id: accountId,
      team_id: result.data.team_id,
      sender_profile_id: senderProfileId,
      receiver_profile_id: result.data.receiver_profile_id,
      category: result.data.category,
      message: result.data.message,
      sprint_id: result.data.sprint_id,
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
