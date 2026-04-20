'use client'

import { UserCircleIcon, IdentificationIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { EditVirtualProfileModal } from './EditVirtualProfileModal'

type Profile = {
  id: string
  display_name: string | null
  avatar_url: string | null
  auth_user_id: string | null
  teams: { team_id: string; name: string; role: string }[]
}

export function DirectoryList({ profiles }: { profiles: Profile[] }) {
  if (profiles.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No directory members found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-surface/50 border-b border-border">
          <tr>
            <th className="px-6 py-4 font-medium text-muted-foreground">Name</th>
            <th className="px-6 py-4 font-medium text-muted-foreground">Type</th>
            <th className="px-6 py-4 font-medium text-muted-foreground">Teams</th>
            <th className="px-6 py-4 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {profiles.map((profile) => (
            <tr key={profile.id} className="hover:bg-surface/30 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full bg-surface" />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-muted-foreground/50" />
                  )}
                  <span className="font-medium text-foreground">
                    {profile.display_name || 'Unnamed Member'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                {profile.auth_user_id ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    Registered Profile
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <IdentificationIcon className="w-3.5 h-3.5" />
                    Virtual Profile
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {profile.teams.map((t) => (
                    <span key={t.team_id} className="px-2 py-0.5 rounded-md text-xs font-medium bg-surface border border-white/10 text-muted-foreground">
                      {t.name}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                 {/* Only virtual profiles should logically be editable globally relative to display_name/avatar here by admins, but for now we'll just have an edit button for virtual profiles */}
                 {!profile.auth_user_id && (
                   <EditVirtualProfileModal profile={profile} />
                 )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
