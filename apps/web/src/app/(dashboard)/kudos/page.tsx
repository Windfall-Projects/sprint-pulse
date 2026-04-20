import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/Card'
import { KudosBoard } from './KudosBoard'
import { CreateKudosModal } from './CreateKudosModal'
import { TeamSelector } from '@/components/ui/TeamSelector'

export const metadata = {
  title: 'Kudos | Sprint Pulse',
}

export default async function KudosPage({
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

  // Generate mapping of auth user id -> profile id
  const { data: currentProfile } = await supabase.from('profiles').select('id').eq('auth_user_id', user.id).single()

  // Fetch all teams for this account
  const { data: teamsData } = await supabase
    .from('teams')
    .select('id, name')
    .eq('account_id', accountId)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  const teams = teamsData || []

  const selectedTeamId = resolvedSearchParams.team || (teams.length > 0 ? teams[0].id : null)

  let kudos = []
  if (selectedTeamId) {
    const { data } = await supabase
      .from('kudos')
      .select('*, sender:profiles!sender_profile_id(display_name, avatar_url), receiver:profiles!receiver_profile_id(display_name, avatar_url)')
      .eq('team_id', selectedTeamId)
      .order('created_at', { ascending: false })
      
    if (data) kudos = data
  }

  // Fetch all members of this team for the Kudos Modal
  let teamProfiles: any[] = []
  if (selectedTeamId) {
     const { data: tMembers } = await supabase
       .from('team_members')
       .select('profiles(id, display_name)')
       .eq('team_id', selectedTeamId)
     if (tMembers) {
        teamProfiles = tMembers.map(m => m.profiles).filter(p => !!p && (p as any).id !== currentProfile?.id)
     }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Kudos Wall</h1>
          <p className="text-muted-foreground mt-1">Recognize your teammates for their great work.</p>
        </div>
        {selectedTeamId && currentProfile?.id && (
           <CreateKudosModal 
             teamId={selectedTeamId as string} 
             accountId={accountId} 
             currentUserProfileId={currentProfile.id}
             teamMembers={teamProfiles} 
           />
        )}
      </div>

      <div>
        {teams.length === 0 ? (
           <Card glass className="p-12 text-center">
            <h3 className="text-lg font-medium text-foreground">No teams found</h3>
            <p className="text-muted-foreground mt-1">You must be in a team to give or view kudos.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            <TeamSelector teams={teams} selectedTeamId={selectedTeamId as string} />

            <KudosBoard kudos={kudos} currentProfileId={currentProfile?.id} />
          </div>
        )}
      </div>
    </div>
  )
}
