'use client'

import { useState } from 'react'
import { createKudos } from './actions'

export function CreateKudosModal({ 
  teamId, 
  accountId,
  currentUserProfileId,
  teamMembers
}: { 
  teamId: string
  accountId: string
  currentUserProfileId: string
  teamMembers: any[] 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    formData.append('teamId', teamId)
    formData.append('accountId', accountId)
    formData.append('senderProfileId', currentUserProfileId)
    
    const res = await createKudos(formData)
    setIsPending(false)

    if (res?.error) {
      if (res.fieldErrors) setErrors(res.fieldErrors)
      return
    }

    setIsOpen(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-md hover:bg-primary-hover transition-colors"
      >
        Give Kudos
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background border border-border w-full max-w-md rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">Shoutout a Teammate</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">To</label>
                <select
                  name="receiverProfileId"
                  required
                  defaultValue=""
                  className="block w-full rounded-md bg-surface border border-border px-3 py-2 text-foreground focus:border-primary focus:outline-none sm:text-sm"
                >
                  <option value="" disabled>Select teammate...</option>
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.display_name}</option>
                  ))}
                </select>
                {errors.receiver_profile_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.receiver_profile_id[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                <select
                  name="category"
                  required
                  className="block w-full rounded-md bg-surface border border-border px-3 py-2 text-foreground focus:border-primary focus:outline-none sm:text-sm"
                >
                  <option value="technical_win">Technical Win</option>
                  <option value="unblock">Unblock</option>
                  <option value="support">Support</option>
                  <option value="team_spirit">Team Spirit</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Message</label>
                <textarea
                  name="message"
                  required
                  className="block w-full rounded-md bg-surface border border-border px-3 py-2 text-foreground focus:border-primary focus:outline-none sm:text-sm h-24 resize-none"
                  placeholder="Thank you for..."
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message[0]}</p>
                )}
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
                  disabled={isPending}
                  className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Sending...' : 'Send Kudos'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
