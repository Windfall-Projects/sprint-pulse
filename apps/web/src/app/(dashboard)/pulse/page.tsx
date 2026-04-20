import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/Card'
import { SurveysList } from './SurveysList'
import { CreateSurveyModal } from './CreateSurveyModal'
import { TeamSelector } from '@/components/ui/TeamSelector'

export const metadata = {
  title: 'Pulse Surveys | Sprint Pulse',
}

export default async function PulsePage({
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
  const isLead = true // Simplified MVP permission: anyone can manage surveys

  let surveys = []
  if (selectedTeamId) {
    // Fetch surveys for this team OR system templates
    const { data } = await supabase
      .from('surveys')
      .select('*, survey_questions(count)')
      .or(`team_id.eq.${selectedTeamId},is_system_template.eq.true`)
      .order('created_at', { ascending: false })
      
    if (data) surveys = data
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Pulse Surveys</h1>
          <p className="text-muted-foreground mt-1">Measure team health and gather feedback.</p>
        </div>
        {selectedTeamId && isLead && <CreateSurveyModal teamId={selectedTeamId} accountId={accountId} />}
      </div>

      <div>
        {teams.length === 0 ? (
           <Card glass className="p-12 text-center">
            <h3 className="text-lg font-medium text-foreground">No teams found</h3>
            <p className="text-muted-foreground mt-1">You must be in a team to view or take pulse surveys.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            <TeamSelector teams={teams} selectedTeamId={selectedTeamId as string} />

            <SurveysList surveys={surveys} teamId={selectedTeamId!} isLead={isLead} />
          </div>
        )}
      </div>
    </div>
  )
}
