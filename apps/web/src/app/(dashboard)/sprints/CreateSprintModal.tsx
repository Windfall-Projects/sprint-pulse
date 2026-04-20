'use client'

import { useState } from 'react'
import { createSprint } from './actions'

export function CreateSprintModal({ teamId }: { teamId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    formData.append('teamId', teamId)
    await createSprint(formData)
    setIsPending(false)
    setIsOpen(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-primary text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
      >
        Create Sprint
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background border border-white/10 w-full max-w-md rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">Create New Sprint</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Sprint Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="block w-full rounded-md bg-surface border border-white/10 px-3 py-2 text-foreground focus:border-primary focus:outline-none sm:text-sm"
                  placeholder="e.g. Sprint 42"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Sprint Goal</label>
                <textarea
                  name="goal"
                  className="block w-full rounded-md bg-surface border border-white/10 px-3 py-2 text-foreground focus:border-primary focus:outline-none sm:text-sm h-20"
                  placeholder="What is the main objective of this sprint?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="block w-full rounded-md bg-surface border border-white/10 px-3 py-2 text-foreground focus:border-primary focus:outline-none sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    className="block w-full rounded-md bg-surface border border-white/10 px-3 py-2 text-foreground focus:border-primary focus:outline-none sm:text-sm"
                  />
                </div>
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
                  className="bg-primary text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
