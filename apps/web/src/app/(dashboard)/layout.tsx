import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopHeader } from '@/components/layout/TopHeader'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Enforce Authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // 2. Fetch Profile to ensure it exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url')
    .eq('auth_user_id', user.id)
    .single()

  let userName = ''
  let avatarUrl = ''

  if (profile) {
    userName = profile.display_name || ''
    avatarUrl = profile.avatar_url || ''

    // 3. User must belong to at least one account.
    const { data: accounts } = await supabase
      .from('account_members')
      .select('account_id')
      .eq('user_id', user.id)
      .limit(1)

    if (!accounts || accounts.length === 0) {
      redirect('/onboarding')
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userName={userName} avatarUrl={avatarUrl} />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
