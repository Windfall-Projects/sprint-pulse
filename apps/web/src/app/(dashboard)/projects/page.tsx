import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/Card'
import { ProjectsList } from './ProjectsList'
import { CreateProjectModal } from './CreateProjectModal'

export const metadata = {
  title: 'Projects | Sprint Pulse',
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // 1. Get the account ID
  const { data: accounts } = await supabase
    .from('account_members')
    .select('account_id')
    .eq('user_id', user.id)
    .limit(1)

  const accountId = accounts?.[0]?.account_id
  if (!accountId) return <div>No account found</div>

  // 2. Fetch teams for this account (to link projects to teams)
  const { data: teams } = await supabase
    .from('teams')
    .select('id, name')
    .eq('account_id', accountId)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  const teamIds = teams?.map((t) => t.id) || []

  // 3. Fetch projects that belong to these teams
  let projects: any[] = []
  if (teamIds.length > 0) {
    const { data: p } = await supabase
      .from('projects')
      .select('*, teams(name)')
      .in('team_id', teamIds)
      .order('created_at', { ascending: false })
    if (p) projects = p
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage active initiatives across your teams.</p>
        </div>
        <CreateProjectModal teams={teams || []} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects && projects.length > 0 ? (
          <ProjectsList projects={projects} />
        ) : (
          <Card glass className="p-12 text-center">
            <h3 className="text-lg font-medium text-foreground">No projects yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">Create your first project to organize work items.</p>
            {(!teams || teams.length === 0) && (
              <p className="text-amber-500 text-sm mb-4">You need to create a Team first before you can create a Project.</p>
            )}
            <CreateProjectModal teams={teams || []} />
          </Card>
        )}
      </div>
    </div>
  )
}
