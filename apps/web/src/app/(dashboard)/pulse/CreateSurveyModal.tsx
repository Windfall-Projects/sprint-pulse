'use client'

import { useState } from 'react'
import { createSurvey } from './actions'
import { CreateSurveySchema } from '@sprintpulse/shared/schemas'

export function CreateSurveyModal({ teamId, accountId }: { teamId: string, accountId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    // Validate with Zod Schema
    const payload = {
      account_id: accountId,
      team_id: teamId,
      title: formData.get('title'),
      is_active: true,
      questions: [{
        question_text: "How satisfied are you with the current sprint?",
        question_type: "scale_1_5",
        order_index: 1,
        is_required: true
      }]
    }

    const result = CreateSurveySchema.safeParse(payload)
    if (!result.success) {
      setError("Invalid form data: " + result.error.errors[0].message)
      setIsPending(false)
      return
    }

    formData.append('teamId', teamId)
    formData.append('accountId', accountId)
    
    // We will hardcode a basic question for the MVP
    await createSurvey(formData)
    
    setIsPending(false)
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
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  className="block w-full rounded-md bg-surface border border-border px-3 py-2 text-foreground focus:border-primary focus:outline-none sm:text-sm"
                  placeholder="Optional context for this survey"
                />
              </div>

              <div className="p-3 bg-surface/50 border border-border rounded-md text-sm text-muted-foreground">
                <p>For this MVP, creating a survey will automatically attach a standard "Satisfaction (1-5)" question to it.</p>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-sm text-red-500 mt-4">
                  {error}
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
