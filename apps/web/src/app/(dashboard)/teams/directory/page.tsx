import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/Card'
import { DirectoryList } from './DirectoryList'
import { CreateVirtualProfileModal } from './CreateVirtualProfileModal'

export const metadata = {
  title: 'Directory | Sprint Pulse',
}

export default async function DirectoryPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get active account
  const { data: accounts } = await supabase
    .from('account_members')
    .select('account_id')
    .eq('user_id', user.id)
    .limit(1)

  const accountId = accounts?.[0]?.account_id
  if (!accountId) return <div>No account found</div>

  // Fetch all teams for this account (for the dropdown)
  const { data: teams } = await supabase
    .from('teams')
    .select('id, name')
    .eq('account_id', accountId)
    .is('deleted_at', null)

  // Fetch all profiles in this account's teams
  const { data: profilesData } = await supabase
    .from('profiles')
    .select(`
      *,
      team_members!inner (
        team_id,
        role,
        teams!inner (
          id,
          name,
          account_id
        )
      )
    `)
    .eq('team_members.teams.account_id', accountId)

  // Deduplicate profiles because a user can be in multiple teams
  const uniqueProfilesMap = new Map()

  profilesData?.forEach((p) => {
    if (!uniqueProfilesMap.has(p.id)) {
      uniqueProfilesMap.set(p.id, {
        id: p.id,
        display_name: p.display_name,
        avatar_url: p.avatar_url,
        auth_user_id: p.auth_user_id,
        teams: p.team_members.map((tm: any) => ({
          team_id: tm.team_id,
          name: tm.teams.name,
          role: tm.role
        }))
      })
    }
  })

  const directoryProfiles = Array.from(uniqueProfilesMap.values())

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <CreateVirtualProfileModal teams={teams || []} />
      </div>

      <Card glass className="p-0 overflow-hidden">
        <DirectoryList profiles={directoryProfiles} />
      </Card>
    </div>
  )
}
