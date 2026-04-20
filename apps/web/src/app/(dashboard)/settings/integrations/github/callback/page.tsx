import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function GitHubCallbackPage({
  searchParams,
}: {
  searchParams: { installation_id?: string; setup_action?: string }
}) {
  const installationId = searchParams.installation_id

  if (!installationId) {
    console.error('No installation_id provided by GitHub')
    redirect('/settings/integrations?error=missing_installation')
  }

  const supabase = await createClient()

  // 1. Get current user's profile to find their account
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // We need the account context. To stay simple, we will fetch the first account this user owns/administers
  const { data: accountMembers } = await supabase
    .from('account_members')
    .select('account_id')
    .eq('user_id', user.id)
    .limit(1)

  const accountId = accountMembers?.[0]?.account_id

  if (!accountId) {
    redirect('/settings/integrations?error=no_account_found')
  }

  // 2. Upsert the integration
  const { error } = await supabase
    .from('integrations')
    .upsert({
      account_id: accountId,
      provider: 'github',
      installation_id: installationId,
    }, { onConflict: 'account_id,provider' })

  if (error) {
    console.error('Failed saving integration:', error)
    redirect('/settings/integrations?error=failed_saving_integration')
  }

  // Redirect back to integrations page with a success flag to show the mapping dropdown
  redirect('/settings/integrations?mapping_setup=true')
}
