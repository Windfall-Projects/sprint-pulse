'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { CreateSprintSchema } from '@sprintpulse/shared/schemas'

export async function createSprint(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const payload = {
    name: formData.get('name') as string,
    goal: formData.get('goal') as string || null,
    start_date: formData.get('startDate') as string,
    end_date: formData.get('endDate') as string,
    team_id: formData.get('teamId') as string,
    status: 'planned'
  }

  const validated = CreateSprintSchema.safeParse(payload)
  if (!validated.success) {
    return { error: 'Validation failed', fieldErrors: validated.error.flatten().fieldErrors }
  }

  // We need the accountId for the teams
  const { data: team } = await supabase.from('teams').select('account_id').eq('id', validated.data.team_id).single()
  
  if (!team) return { error: 'Team not found' }

  const { error } = await supabase
    .from('sprints')
    .insert({
      account_id: team.account_id,
      ...validated.data
    })

  if (error) {
    console.error('Failed to create sprint', error)
    return { error: 'Failed to create sprint' }
  }

  revalidatePath('/sprints')
  return { success: true }
}
