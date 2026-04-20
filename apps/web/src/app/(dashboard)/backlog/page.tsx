import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/Card'
import { BacklogBoard } from './BacklogBoard'

export const metadata = {
  title: 'Backlog | Sprint Pulse',
}

export default async function BacklogPage({
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

  // Determine selected team
  const selectedTeamId = resolvedSearchParams.team || (teams.length > 0 ? teams[0].id : null)

  let workItems = []
  if (selectedTeamId) {
    const { data: items } = await supabase
      .from('work_items')
      .select('*, projects(name), profiles(display_name, avatar_url)')
      .eq('team_id', selectedTeamId)
      // .is('sprint_id', null) // We can fetch all and segregate on client side
      .order('created_at', { ascending: false })
      
    if (items) workItems = items
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Backlog</h1>
          <p className="text-muted-foreground mt-1">Plan and prioritize work items.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        {teams.length === 0 ? (
           <Card glass className="p-12 text-center">
            <h3 className="text-lg font-medium text-foreground">No teams found</h3>
            <p className="text-muted-foreground mt-1 mb-4">You need to be added to a team to view backlogs.</p>
          </Card>
        ) : (
          <BacklogBoard 
            teams={teams} 
            selectedTeamId={selectedTeamId as string} 
            initialWorkItems={workItems} 
            accountId={accountId}
          />
        )}
      </div>
    </div>
  )
}
