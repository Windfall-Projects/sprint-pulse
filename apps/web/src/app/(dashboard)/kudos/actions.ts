'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createKudos(formData: FormData) {
  const supabase = await createClient()

  const accountId = formData.get('accountId') as string
  const teamId = formData.get('teamId') as string
  const senderProfileId = formData.get('senderProfileId') as string
  const receiverProfileId = formData.get('receiverProfileId') as string
  const category = formData.get('category') as string
  const message = formData.get('message') as string

  if (!message || !receiverProfileId) return { error: 'Required fields missing' }

  const { error } = await supabase
    .from('kudos')
    .insert({
      account_id: accountId,
      team_id: teamId,
      sender_profile_id: senderProfileId,
      receiver_profile_id: receiverProfileId,
      category,
      message,
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
