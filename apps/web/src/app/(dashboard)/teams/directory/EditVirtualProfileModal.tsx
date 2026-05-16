'use client'

import { useState } from 'react'
import { updateVirtualProfileAction } from '../actions'

type ProfileToEdit = {
  id: string
  display_name: string | null
  avatar_url: string | null
}

export function EditVirtualProfileModal({ profile }: { profile: ProfileToEdit }) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayName, setDisplayName] = useState(profile.display_name || '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')
  const [isPending, setIsPending] = useState(false)
  const [errorStatus, setErrorStatus] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim()) return

    setIsPending(true)
    setErrorStatus(null)

    const formData = new FormData()
    formData.append('profileId', profile.id)
    formData.append('displayName', displayName)
    if (avatarUrl) formData.append('avatarUrl', avatarUrl)

    const result = await updateVirtualProfileAction(null, formData)
    
    if (result.error) {
      setErrorStatus(result.error)
      setIsPending(false)
    } else {
      setIsPending(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background border border-border w-full max-w-md rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">Edit Virtual Member</h2>

            {errorStatus && (
              <div className="mb-4 p-3 rounded-md bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20">
                {errorStatus}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isPending}
                  className="block w-full rounded-md bg-surface border border-border px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Avatar URL <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  disabled={isPending}
                  className="block w-full rounded-md bg-surface border border-border px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-surface rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !displayName.trim()}
                  className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
