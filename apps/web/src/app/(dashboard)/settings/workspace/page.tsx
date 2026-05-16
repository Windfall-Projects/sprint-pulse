import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/Card'
import { WorkspaceSettingsForm } from './WorkspaceSettingsForm'
import { MembersList } from './MembersList'

export const metadata = {
  title: 'Workspace Settings | Sprint Pulse',
}

export default async function WorkspaceSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch the first account the user is a member of
  const { data: memberships } = await supabase
    .from('account_members')
    .select('role, account_id, accounts(*)')
    .eq('user_id', user.id)
    .limit(1)

  const membership = memberships?.[0]
  if (!membership || !membership.accounts) {
    return <div>No workspace found.</div>
  }

  const account = membership.accounts as any
  const currentUserRole = membership.role

  // Fetch all members of this account
  const { data: allMembers } = await supabase
    .from('account_members')
    .select('user_id, role, created_at')
    .eq('account_id', account.id)

  const memberUserIds = allMembers?.map(m => m.user_id) || []

  // Fetch profiles for these users
  let profiles: any[] = []
  if (memberUserIds.length > 0) {
    const { data: p } = await supabase
      .from('profiles')
      .select('auth_user_id, display_name, avatar_url')
      .in('auth_user_id', memberUserIds)
    if (p) profiles = p
  }

  // Combine data
  const membersWithProfiles = allMembers?.map(member => {
    const profile = profiles.find(p => p.auth_user_id === member.user_id)
    return {
      ...member,
      display_name: profile?.display_name || 'Unknown User',
      avatar_url: profile?.avatar_url || null,
    }
  }) || []

  return (
    <div className="space-y-6">
      <Card glass className="p-6">
        <h2 className="text-xl font-bold mb-4">Workspace Details</h2>
        <WorkspaceSettingsForm 
          accountId={account.id} 
          initialName={account.name} 
          canEdit={currentUserRole === 'admin' || currentUserRole === 'owner'}
        />
      </Card>

      <Card glass className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Workspace Members</h2>
          {(currentUserRole === 'admin' || currentUserRole === 'owner') && (
            <button className="bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium rounded-md hover:bg-primary-hover transition-colors">
              Invite Member
            </button>
          )}
        </div>
        <MembersList 
          members={membersWithProfiles} 
          currentUserRole={currentUserRole} 
          accountId={account.id}
        />
      </Card>
    </div>
  )
}
