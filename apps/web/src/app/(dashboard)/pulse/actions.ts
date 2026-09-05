'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { CreateSurveySchema } from '@sprintpulse/shared'

export async function createSurvey(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const description = formData.get('description') as string

  const payload = {
    title: formData.get('title'),
    team_id: formData.get('teamId') || null,
    account_id: formData.get('accountId'),
    questions: []
  }

  const parsed = CreateSurveySchema.safeParse(payload)

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // Use the RPC to create a survey with a default question
  const defaultQuestions = [{
    question_text: "How satisfied are you with the current sprint?",
    response_type: "scale_1_5",
    metric_category: "satisfaction",
    order_index: 1,
    is_required: true
  }]

  const { error } = await supabase.rpc('create_survey_with_questions', {
    p_account_id: parsed.data.account_id,
    p_team_id: parsed.data.team_id,
    p_title: parsed.data.title,
    p_is_active: true,
    p_questions: defaultQuestions
  })

  // Set description explicitly if we can't via RPC
  if (!error && description) {
     // get latest survey mapping and update
     const { data } = await supabase.from('surveys').select('id').eq('title', parsed.data.title).eq('team_id', parsed.data.team_id).order('created_at', { ascending: false }).limit(1)
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
