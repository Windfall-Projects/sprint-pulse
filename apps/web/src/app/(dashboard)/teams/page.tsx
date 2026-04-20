import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/Card'
import { TeamsList } from './TeamsList'
import { CreateTeamModal } from './CreateTeamModal'

export const metadata = {
  title: 'Teams | Sprint Pulse',
}

export default async function TeamsPage() {
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

  // Fetch teams for this account (not soft deleted)
  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .eq('account_id', accountId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <CreateTeamModal accountId={accountId} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {teams && teams.length > 0 ? (
          <TeamsList teams={teams} />
        ) : (
          <Card glass className="p-12 text-center">
            <h3 className="text-lg font-medium text-foreground">No teams yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">Create your first team to start planning sprints.</p>
            <CreateTeamModal accountId={accountId} />
          </Card>
        )}
      </div>
    </div>
  )
}
