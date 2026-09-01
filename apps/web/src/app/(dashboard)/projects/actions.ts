'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { CreateProjectSchema } from '@sprintpulse/shared'

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const teamId = formData.get('teamId') as string

  const parsed = CreateProjectSchema.safeParse({
    name,
    description: description || null,
    team_id: teamId
  })

  if (!parsed.success) {
    return { error: 'Invalid input: ' + parsed.error.issues[0].message }
  }

  const { error } = await supabase
    .from('projects')
    .insert({
      team_id: parsed.data.team_id,
      name: parsed.data.name,
      description: parsed.data.description,
      status: 'active'
    })

  if (error) {
    console.error('Failed to create project', error)
    return { error: 'Failed to create project.' }
  }

  revalidatePath('/projects')
  return { success: true }
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Since it's a soft delete usually, wait - ProjectSchema doesn't have deleted_at field.
  // It has a status enum: 'active', 'archived', 'completed'.
  // Let's archive it instead of deleting rows which might cascade delete work items.
  const { error } = await supabase
    .from('projects')
    .update({ status: 'archived' })
    .eq('id', projectId)

  if (error) {
    console.error('Failed to update project', error)
    return { error: 'Failed to delete project.' }
  }

  revalidatePath('/projects')
  return { success: true }
}
