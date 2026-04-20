import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/Card'
import { SprintsList } from './SprintsList'
import { CreateSprintModal } from './CreateSprintModal'
import { TeamSelector } from '@/components/ui/TeamSelector'

export const metadata = {
  title: 'Sprints | Sprint Pulse',
}

export default async function SprintsPage({
  searchParams
}: {
  searchParams: Promise<{ team?: string }>
}) {
  const resolvedSearchParams = await searchParams
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

  // Fetch all teams for this account
  const { data: teamsData } = await supabase
    .from('teams')
    .select('id, name')
    .eq('account_id', accountId)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  const teams = teamsData || []

  const selectedTeamId = resolvedSearchParams.team || (teams.length > 0 ? teams[0].id : null)

  let sprints = []
  if (selectedTeamId) {
    const { data } = await supabase
      .from('sprints')
      .select('*')
      .eq('team_id', selectedTeamId)
      .order('start_date', { ascending: false })
      
    if (data) sprints = data
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Sprints</h1>
          <p className="text-muted-foreground mt-1">Plan and manage team sprints.</p>
        </div>
        {selectedTeamId && <CreateSprintModal teamId={selectedTeamId as string} />}
      </div>

      <div>
        {teams.length === 0 ? (
           <Card glass className="p-12 text-center">
            <h3 className="text-lg font-medium text-foreground">No teams found</h3>
            <p className="text-muted-foreground mt-1">Join a team to start creating sprints.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            <TeamSelector teams={teams} selectedTeamId={selectedTeamId as string} />

            <SprintsList sprints={sprints} selectedTeamId={selectedTeamId as string} />
          </div>
        )}
      </div>
    </div>
  )
}
