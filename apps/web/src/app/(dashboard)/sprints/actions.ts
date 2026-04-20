'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSprint(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const name = formData.get('name') as string
  const goal = formData.get('goal') as string
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string
  const teamId = formData.get('teamId') as string

  // We need the accountId for the teams
  const { data: team } = await supabase.from('teams').select('account_id').eq('id', teamId).single()
  
  if (!team) return { error: 'Team not found' }

  const { error } = await supabase
    .from('sprints')
    .insert({
      account_id: team.account_id,
      team_id: teamId,
      name,
      goal: goal || null,
      start_date: startDate,
      end_date: endDate,
      status: 'planned'
    })

  if (error) {
    console.error('Failed to create sprint', error)
    return { error: 'Failed to create sprint' }
  }

  revalidatePath('/sprints')
  return { success: true }
}
