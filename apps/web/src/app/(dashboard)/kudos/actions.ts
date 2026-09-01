'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { GiveKudosSchema } from '@sprintpulse/shared'

export async function createKudos(formData: FormData) {
  const supabase = await createClient()

  const accountId = formData.get('accountId') as string
  const senderProfileId = formData.get('senderProfileId') as string

  const parsed = GiveKudosSchema.safeParse({
    team_id: formData.get('teamId'),
    sprint_id: formData.get('sprintId') || null,
    receiver_profile_id: formData.get('receiverProfileId'),
    category: formData.get('category') || null,
    message: formData.get('message'),
  })

  if (!parsed.success) {
    return { error: 'Invalid input' }
  }

  const { error } = await supabase
    .from('kudos')
    .insert({
      account_id: accountId,
      team_id: parsed.data.team_id,
      sprint_id: parsed.data.sprint_id,
      sender_profile_id: senderProfileId,
      receiver_profile_id: parsed.data.receiver_profile_id,
      category: parsed.data.category,
      message: parsed.data.message,
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
