'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { GiveKudosSchema } from '@sprintpulse/shared'

export async function createKudos(formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    team_id: formData.get('teamId') as string,
    receiver_profile_id: formData.get('receiverProfileId') as string,
    category: formData.get('category') as string,
    message: formData.get('message') as string,
    sprint_id: formData.get('sprintId') as string || null,
  }

  const parsed = GiveKudosSchema.safeParse(rawData)

  if (!parsed.success) {
    return { error: 'Required fields missing or invalid' }
  }

  const accountId = formData.get('accountId') as string
  const senderProfileId = formData.get('senderProfileId') as string

  if (!accountId || !senderProfileId) return { error: 'Required context missing' }

  const { error } = await supabase
    .from('kudos')
    .insert({
      account_id: accountId,
      sender_profile_id: senderProfileId,
      ...parsed.data,
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
