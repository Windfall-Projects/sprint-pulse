import { createClient } from '@/utils/supabase/server'
import { StatCard } from '@/components/dashboard/StatCard'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Dashboard | Sprint Pulse',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch the latest account name
  const { data: accounts } = await supabase
    .from('account_members')
    .select('account_id, accounts(name)')
    .eq('user_id', user.id)
    .limit(1)

  const accountName = (accounts?.[0]?.accounts as any)?.name || 'Your Workspace'

  // Fetch the user's profile for their name
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, id')
    .eq('auth_user_id', user.id)
    .single()

  const displayName = profile?.display_name?.split(' ')[0] || 'there'

  // Fetch team
  const { data: teams } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('profile_id', profile?.id)
    .limit(1)
    
  const teamId = teams?.[0]?.team_id

  // Fetch Active Sprint
  let activeSprint = null
  if (teamId) {
    const { data } = await supabase
      .from('sprints')
      .select('*')
      .eq('team_id', teamId)
      .eq('status', 'active')
      .order('start_date', { ascending: false })
      .limit(1)
    if (data && data.length > 0) activeSprint = data[0]
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Intro Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-muted-foreground">{accountName}</p>
          <h1 className="text-3xl font-bold tracking-tight">Good morning, {displayName}</h1>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <StatCard 
          title="Active Sprint" 
          value={activeSprint ? activeSprint.name : '—'}
          color="blue"
        />
        <StatCard 
          title="Avg Velocity" 
          value="—"
          color="teal"
        />
        <StatCard 
          title="Pulse Score" 
          value="—"
          color="amber"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Current Sprint</h2>
          {activeSprint ? (
            <Card>
              <h3 className="font-semibold text-lg">{activeSprint.name}</h3>
              <p className="text-muted-foreground text-sm">{activeSprint.goal}</p>
            </Card>
          ) : (
            <EmptyState 
              title="No active sprint" 
              description="Start a sprint to begin tracking your team's velocity and pulse."
              actionLabel="Plan Sprint"
            />
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Pending Surveys</h2>
          <Card className="p-4 border-l-4 border-l-primary">
            <h4 className="font-medium text-sm">Sprint End Pulse</h4>
            <p className="text-xs text-muted-foreground mt-1">Takes 2 minutes</p>
            <div className="mt-3">
              <button className="text-sm font-medium text-primary hover:underline">
                Take Survey &rarr;
              </button>
            </div>
          </Card>
        </div>
      </div>

    </div>
  )
}
