'use client'

import { useState } from 'react'
import { createSprint } from './actions'

export function CreateSprintModal({ teamId }: { teamId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    formData.append('teamId', teamId)
    const res = await createSprint(formData)
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
        Create Sprint
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background border border-border w-full max-w-md rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">Create New Sprint</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Sprint Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="block w-full rounded-md bg-surface border border-border px-3 py-2 text-foreground focus:border-primary focus:outline-none sm:text-sm"
                  placeholder="e.g. Sprint 42"
                  autoFocus
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Sprint Goal</label>
                <textarea
                  name="goal"
                  className="block w-full rounded-md bg-surface border border-border px-3 py-2 text-foreground focus:border-primary focus:outline-none sm:text-sm h-20"
                  placeholder="What is the main objective of this sprint?"
                />
                {errors.goal && (
                  <p className="text-red-500 text-xs mt-1">{errors.goal[0]}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="block w-full rounded-md bg-surface border border-border px-3 py-2 text-foreground focus:border-primary focus:outline-none sm:text-sm"
                  />
                  {errors.start_date && (
                    <p className="text-red-500 text-xs mt-1">{errors.start_date[0]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    className="block w-full rounded-md bg-surface border border-border px-3 py-2 text-foreground focus:border-primary focus:outline-none sm:text-sm"
                  />
                  {errors.end_date && (
                    <p className="text-red-500 text-xs mt-1">{errors.end_date[0]}</p>
                  )}
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
                  className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50"
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
