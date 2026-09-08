'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { CreateSurveySchema } from '@sprintpulse/shared'

export async function createSurvey(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const description = formData.get('description') as string

  const defaultQuestions = [{
    question_text: "How satisfied are you with the current sprint?",
    question_type: "scale_1_5" as const,
    order_index: 1,
    is_required: true
  }]

  const payload = {
    account_id: formData.get('accountId'),
    team_id: formData.get('teamId') || null,
    title: formData.get('title'),
    is_active: true,
    questions: defaultQuestions,
  }

  const parsed = CreateSurveySchema.safeParse(payload)

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { error } = await supabase.rpc('create_survey_with_questions', {
    p_account_id: parsed.data.account_id,
    p_team_id: parsed.data.team_id,
    p_title: parsed.data.title,
    p_is_active: parsed.data.is_active,
    p_questions: parsed.data.questions.map(q => ({
      question_text: q.question_text,
      response_type: q.question_type, // DB RPC expects response_type
      metric_category: "satisfaction",
      order_index: q.order_index,
      is_required: q.is_required
    }))
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
