'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSurvey(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const teamId = formData.get('teamId') as string
  const accountId = formData.get('accountId') as string

  if (!title) return { error: 'Title is required' }

  // Use the RPC to create a survey with a default question
  const defaultQuestions = [{
    question_text: "How satisfied are you with the current sprint?",
    response_type: "scale_1_5",
    metric_category: "satisfaction",
    order_index: 1,
    is_required: true
  }]

  const { error } = await supabase.rpc('create_survey_with_questions', {
    p_account_id: accountId,
    p_team_id: teamId,
    p_title: title,
    p_is_active: true,
    p_questions: defaultQuestions
  })

  // Set description explicitly if we can't via RPC
  if (!error && description) {
     // get latest survey mapping and update
     const { data } = await supabase.from('surveys').select('id').eq('title', title).eq('team_id', teamId).order('created_at', { ascending: false }).limit(1)
     if (data && data.length > 0) {
        await supabase.from('surveys').update({ description }).eq('id', data[0].id)
     }
  }

  if (error) {
    console.error('Failed to create survey', error)
    return { error: 'Failed' }
  }

  revalidatePath('/pulse')
  return { success: true }
}
