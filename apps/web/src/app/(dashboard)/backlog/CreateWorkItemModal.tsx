'use client'

import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { createWorkItem } from './actions'

export function CreateWorkItemModal({ teamId, accountId }: { teamId: string, accountId: string }) {
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
    const res = await createWorkItem(formData)
    setIsPending(false)

    if (res?.error) {
      if (res.fieldErrors) setErrors(res.fieldErrors)
      return
    }

    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-3 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-surface/50 transition-colors flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-4 h-4" /> Add Item
      </button>
    )
  }

  return (
    <div className="bg-surface/50 border border-primary/30 p-4 rounded-lg animate-in fade-in zoom-in-95 duration-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          required
          autoFocus
          className="w-full bg-surface border border-border rounded px-3 py-1.5 text-sm"
          placeholder="What needs to be done?"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>
        )}
        <div className="grid grid-cols-2 gap-3">
           <div>
             <label className="text-xs text-muted-foreground mb-1 block">Type</label>
             <select name="type" className="w-full bg-surface border border-border rounded px-2 py-1 text-sm">
                <option value="story">Story</option>
                <option value="task">Task</option>
                <option value="bug">Bug</option>
                <option value="chore">Chore</option>
             </select>
             {errors.type && (
               <p className="text-red-500 text-xs mt-1">{errors.type[0]}</p>
             )}
           </div>
           <div>
             <label className="text-xs text-muted-foreground mb-1 block">Points</label>
             <input name="points" type="number" min="0" defaultValue="0" className="w-full bg-surface border border-border rounded px-2 py-1 text-sm" />
             {errors.story_points && (
               <p className="text-red-500 text-xs mt-1">{errors.story_points[0]}</p>
             )}
           </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button type="button" onClick={() => setIsOpen(false)} className="text-xs px-3 py-1 rounded hover:bg-surface-hover disabled:opacity-50" disabled={isPending}>Cancel</button>
          <button type="submit" className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary-hover disabled:opacity-50" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
