import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/Card'
import { ChartBarIcon, FireIcon, HandThumbUpIcon } from '@heroicons/react/24/outline'
import { TeamSelector } from '@/components/ui/TeamSelector'

export const metadata = {
  title: 'Analytics | Sprint Pulse',
}

export default async function AnalyticsPage({
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

  let historicalMetrics = []
  if (selectedTeamId) {
    const { data } = await supabase
      .from('historical_metrics')
      .select('*')
      .eq('team_id', selectedTeamId)
      .is('user_id', null) // Fetch team-level metrics, ignoring individual ones if they exist
      .order('metric_date', { ascending: true }) // chronological
      
    if (data) historicalMetrics = data
  }

  // Calculate simple aggregations for MVP dashboard
  const latestMetric = historicalMetrics.length > 0 ? historicalMetrics[historicalMetrics.length - 1] : null
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Team Analytics</h1>
          <p className="text-muted-foreground mt-1">Velocity and health metrics over time.</p>
        </div>
      </div>

      <div>
        {teams.length === 0 ? (
           <Card glass className="p-12 text-center">
            <h3 className="text-lg font-medium text-foreground">No teams found</h3>
            <p className="text-muted-foreground mt-1">You must be in a team to view analytics.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            <TeamSelector teams={teams} selectedTeamId={selectedTeamId as string} />

            {/* Dashboards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card glass className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                     <FireIcon className="w-5 h-5 text-amber-500" />
                     <h3 className="font-semibold text-muted-foreground">Avg Velocity</h3>
                  </div>
                  <p className="text-3xl font-bold">{latestMetric?.velocity_avg || '-'}</p>
               </Card>
               <Card glass className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                     <HandThumbUpIcon className="w-5 h-5 text-emerald-500" />
                     <h3 className="font-semibold text-muted-foreground">Satisfaction</h3>
                  </div>
                  <p className="text-3xl font-bold">{latestMetric?.satisfaction_score ? `${latestMetric.satisfaction_score} / 5` : '-'}</p>
               </Card>
               <Card glass className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                     <ChartBarIcon className="w-5 h-5 text-blue-500" />
                     <h3 className="font-semibold text-muted-foreground">Flow Score</h3>
                  </div>
                  <p className="text-3xl font-bold">{latestMetric?.flow_score ? `${latestMetric.flow_score} / 5` : '-'}</p>
               </Card>
            </div>

            <Card glass className="p-8 text-center text-muted-foreground border-dashed mt-8">
              <ChartBarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3>Visual Charts Coming Soon</h3>
              <p className="text-sm mt-2">Historical charting for sprints will be displayed here as more data is collected.</p>
            </Card>

          </div>
        )}
      </div>
    </div>
  )
}
