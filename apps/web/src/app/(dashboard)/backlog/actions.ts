'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { CreateWorkItemSchema } from '@sprintpulse/shared/schemas'

export async function createWorkItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const accountId = formData.get('accountId') as string

  const payload = {
    title: formData.get('title') as string,
    type: formData.get('type') as string,
    story_points: parseInt(formData.get('points') as string || '0', 10),
    team_id: formData.get('teamId') as string,
  }

  const validated = CreateWorkItemSchema.safeParse(payload)
  if (!validated.success) {
    return { error: 'Validation failed', fieldErrors: validated.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from('work_items')
    .insert({
      account_id: accountId,
      status: 'todo',
      ...validated.data
    })

  if (error) {
    console.error('Failed to create work item', error)
    return { error: 'Failed to create work item' }
  }

  revalidatePath('/backlog')
  return { success: true }
}
