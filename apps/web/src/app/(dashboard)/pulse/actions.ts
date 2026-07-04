'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { CreateSurveySchema } from '@sprintpulse/shared/schemas'

export async function createSurvey(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const description = formData.get('description') as string

  const payload = {
    title: formData.get('title') as string,
    team_id: formData.get('teamId') as string,
    account_id: formData.get('accountId') as string,
    questions: [{
      question_text: "How satisfied are you with the current sprint?",
      question_type: "scale",
      order_index: 1,
      is_required: true
    }]
  }

  const validated = CreateSurveySchema.safeParse(payload)
  if (!validated.success) {
    return { error: 'Validation failed', fieldErrors: validated.error.flatten().fieldErrors }
  }

  // Map API schema shape to DB RPC expected shape
  const rpcQuestions = validated.data.questions.map(q => ({
    question_text: q.question_text,
    response_type: q.question_type === 'scale' ? 'scale_1_5' : 'text',
    metric_category: "satisfaction",
    order_index: q.order_index,
    is_required: q.is_required
  }))

  const { error } = await supabase.rpc('create_survey_with_questions', {
    p_account_id: validated.data.account_id,
    p_team_id: validated.data.team_id,
    p_title: validated.data.title,
    p_is_active: true,
    p_questions: rpcQuestions
  })

  // Set description explicitly if we can't via RPC
  if (!error && description) {
     // get latest survey mapping and update
     const { data } = await supabase.from('surveys').select('id').eq('title', validated.data.title).eq('team_id', validated.data.team_id).order('created_at', { ascending: false }).limit(1)
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
