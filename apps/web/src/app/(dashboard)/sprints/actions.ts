'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { CreateSprintSchema } from '@sprintpulse/shared'

export async function createSprint(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const validatedFields = CreateSprintSchema.safeParse({
    name: formData.get('name'),
    goal: formData.get('goal') || null,
    start_date: formData.get('startDate'),
    end_date: formData.get('endDate'),
    team_id: formData.get('teamId'),
    status: 'planned'
  })

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { name, goal, start_date, end_date, team_id, status } = validatedFields.data

  // We need the accountId for the teams
  const { data: team } = await supabase.from('teams').select('account_id').eq('id', team_id).single()
  
  if (!team) return { error: 'Team not found' }

  const { error } = await supabase
    .from('sprints')
    .insert({
      account_id: team.account_id,
      team_id,
      name,
      goal,
      start_date,
      end_date,
      status
    })

  if (error) {
    console.error('Failed to create sprint', error)
    return { error: 'Failed to create sprint' }
  }

  revalidatePath('/sprints')
  return { success: true }
}
