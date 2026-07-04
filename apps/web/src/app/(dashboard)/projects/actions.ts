'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { CreateProjectSchema } from '@sprintpulse/shared/schemas'

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const payload = {
    team_id: formData.get('teamId') as string,
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
  }

  const validated = CreateProjectSchema.safeParse(payload)
  if (!validated.success) {
    return { error: 'Validation failed', fieldErrors: validated.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from('projects')
    .insert({
      team_id: validated.data.team_id,
      name: validated.data.name,
      description: validated.data.description,
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
