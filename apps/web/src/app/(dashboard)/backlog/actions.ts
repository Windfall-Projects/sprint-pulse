'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { CreateWorkItemSchema } from '@sprintpulse/shared'

export async function createWorkItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const accountId = formData.get('accountId') as string

  const payload = {
    team_id: formData.get('teamId') as string,
    title: formData.get('title') as string,
    type: formData.get('type') as string || 'story',
    story_points: parseInt(formData.get('points') as string || '0', 10),
  }

  const parsed = CreateWorkItemSchema.safeParse(payload)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { error } = await supabase
    .from('work_items')
    .insert({
      account_id: accountId,
      ...parsed.data,
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
