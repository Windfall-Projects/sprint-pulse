'use server'

import { createClient } from '@/utils/supabase/server'
import jwt from 'jsonwebtoken'
import { revalidatePath } from 'next/cache'

export async function getGitHubRepositories(integrationId: string) {
  const supabase = await createClient()

  const { data: integration, error: intError } = await supabase
    .from('integrations')
    .select('installation_id, provider')
    .eq('id', integrationId)
    .single()

  if (intError || !integration || integration.provider !== 'github') {
    return { error: 'Invalid integration access' }
  }

  const installationId = integration.installation_id
  if (!installationId) return { error: 'Missing installation_id' }

  // 1. Create JWT
  const privateKey = process.env.GITHUB_PRIVATE_KEY
  const appId = process.env.GITHUB_APP_ID

  if (!privateKey || !appId) {
    return { error: 'Server missing GitHub App configuration (Private Key or App ID).' }
  }

  const payload = {
    iat: Math.floor(Date.now() / 1000) - 60,
    exp: Math.floor(Date.now() / 1000) + (10 * 60),
    iss: appId
  }

  const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' })

  // 2. Exchange for Installation Access Token
  const tokenRes = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Sprint-Pulse-App'
    }
  })

  if (!tokenRes.ok) {
    return { error: 'Failed validating installation with GitHub' }
  }

  const { token: installationToken } = await tokenRes.json()

  // 3. Get repositories
  const repoRes = await fetch('https://api.github.com/installation/repositories', {
    headers: {
      'Authorization': `Bearer ${installationToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Sprint-Pulse-App'
    }
  })

  if (!repoRes.ok) {
    return { error: 'Failed fetching repositories' }
  }

  const repoData = await repoRes.json()
  const repos = repoData.repositories.map((r: any) => ({
    id: r.id,
    full_name: r.full_name,
    private: r.private
  }))

  return { repos }
}

export async function createIntegrationMapping({
  integrationId, externalRepoId, teamId, projectId
}: {
  integrationId: string,
  externalRepoId: string,
  teamId: string,
  projectId?: string
}) {
  const supabase = await createClient()
  
  const payload: any = {
    integration_id: integrationId,
    external_repo_id: externalRepoId,
    team_id: teamId,
    is_active: true
  }

  if (projectId) {
    payload.project_id = projectId;
  }

  const { data, error } = await supabase
    .from('integration_mappings')
    .insert(payload)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const { data: session } = await supabase.auth.getSession()
  
  if (supabaseUrl && session?.session?.access_token) {
    // Fire and forget proxy sync to standard Edge Function API
    fetch(`${supabaseUrl}/functions/v1/api/github/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.session.access_token}`
      },
      body: JSON.stringify({ mapping_id: data.id })
    }).catch(() => {})
  }

  revalidatePath('/settings/integrations')
  return { success: true }
}
