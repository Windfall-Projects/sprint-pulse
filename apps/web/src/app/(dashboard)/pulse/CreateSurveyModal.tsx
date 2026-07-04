'use client'

import { useState } from 'react'
import { createSurvey } from './actions'

export function CreateSurveyModal({ teamId, accountId }: { teamId: string, accountId: string }) {
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
    
    // We will hardcode a basic question for the MVP
    const res = await createSurvey(formData)
    
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
        Create Survey
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background border border-border w-full max-w-md rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">Create New Survey</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Survey Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="block w-full rounded-md bg-surface border border-border px-3 py-2 text-foreground focus:border-primary focus:outline-none sm:text-sm"
                  placeholder="e.g. Mid-Sprint Check-in"
                  autoFocus
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  className="block w-full rounded-md bg-surface border border-border px-3 py-2 text-foreground focus:border-primary focus:outline-none sm:text-sm"
                  placeholder="Optional context for this survey"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>
                )}
              </div>

              <div className="p-3 bg-surface/50 border border-border rounded-md text-sm text-muted-foreground">
                <p>For this MVP, creating a survey will automatically attach a standard "Satisfaction (1-5)" question to it.</p>
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
