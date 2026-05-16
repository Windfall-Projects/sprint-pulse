'use client'

import { useState } from 'react'
import { createVirtualProfileAction } from '../actions'

export function CreateVirtualProfileModal({ teams }: { teams: { id: string, name: string }[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [isPending, setIsPending] = useState(false)
  const [errorStatus, setErrorStatus] = useState<string | null>(null)

  function toggleTeam(teamId: string) {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim()) return

    setIsPending(true)
    setErrorStatus(null)

    const formData = new FormData()
    formData.append('displayName', displayName)
    if (avatarUrl) formData.append('avatarUrl', avatarUrl)
    
    selectedTeams.forEach(teamId => {
      formData.append('teamIds', teamId)
    })

    const result = await createVirtualProfileAction(null, formData)
    
    if (result.error) {
      setErrorStatus(result.error)
      setIsPending(false)
    } else {
      setIsPending(false)
      setIsOpen(false)
      setDisplayName('')
      setAvatarUrl('')
      setSelectedTeams([])
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-md hover:bg-primary-hover transition-colors"
      >
        Create Virtual Member
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background border border-border w-full max-w-md rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">Create Virtual Member</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Virtual members can be assigned work items but cannot log in.
            </p>

            {errorStatus && (
              <div className="mb-4 p-3 rounded-md bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20">
                {errorStatus}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-foreground mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isPending}
                  className="block w-full rounded-md bg-surface border border-border px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="e.g. GitHub Bot or John Doe"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-foreground mb-1">
                  Avatar URL <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  id="avatarUrl"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  disabled={isPending}
                  className="block w-full rounded-md bg-surface border border-border px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="https://example.com/avatar.png"
                />
              </div>

              {teams.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Assign to Teams <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <div className="max-h-40 overflow-y-auto space-y-2 border border-border p-3 rounded-md bg-surface/30">
                    {teams.map((team) => (
                      <label key={team.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTeams.includes(team.id)}
                          onChange={() => toggleTeam(team.id)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary bg-surface"
                        />
                        <span className="text-sm font-medium text-foreground">{team.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
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
                  {isPending ? 'Creating...' : 'Create Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
