'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createWorkItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  const type = formData.get('type') as string
  const points = parseInt(formData.get('points') as string || '0', 10)
  const teamId = formData.get('teamId') as string
  const accountId = formData.get('accountId') as string

  if (!title) return { error: 'Title is required' }

  const { error } = await supabase
    .from('work_items')
    .insert({
      account_id: accountId,
      team_id: teamId,
      title,
      type,
      story_points: points,
      status: 'todo',
      provider: 'native'
    })

  if (error) {
    console.error('Failed to create work item', error)
    return { error: 'Failed to create work item' }
  }

  revalidatePath('/backlog')
  return { success: true }
}
