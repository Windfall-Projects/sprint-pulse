'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { CreateSprintSchema } from '@sprintpulse/shared'

export async function createSprint(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const teamId = formData.get('teamId') as string
  const payload = {
    team_id: teamId,
    name: formData.get('name') as string,
    goal: formData.get('goal') as string || null,
    start_date: formData.get('startDate') as string,
    end_date: formData.get('endDate') as string,
  }

  // We need the accountId for the teams
  const { data: team } = await supabase.from('teams').select('account_id').eq('id', teamId).single()
  
  if (!team) return { error: 'Team not found' }

  const parsed = CreateSprintSchema.safeParse(payload)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { error } = await supabase
    .from('sprints')
    .insert({
      account_id: team.account_id,
      ...parsed.data,
      status: 'planned'
    })

  if (error) {
    console.error('Failed to create sprint', error)
    return { error: 'Failed to create sprint' }
  }

  revalidatePath('/sprints')
  return { success: true }
}
