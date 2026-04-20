import { createClient } from '@/utils/supabase/server'
import { ProfileForm } from './ProfileForm'

export default async function SettingsProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  let displayName = ''
  let avatarUrl = ''

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('auth_user_id', user.id)
      .single()

    if (profile) {
      displayName = profile.display_name || ''
      avatarUrl = profile.avatar_url || ''
    }
  }

  return (
    <div className="space-y-6">
      <ProfileForm 
        initialDisplayName={displayName} 
        initialAvatarUrl={avatarUrl} 
      />
    </div>
  )
}
