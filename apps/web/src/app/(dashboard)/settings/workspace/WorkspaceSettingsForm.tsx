'use client'

import { useState } from 'react'
import { updateWorkspaceName } from './actions'

export function WorkspaceSettingsForm({ 
  accountId, 
  initialName, 
  canEdit 
}: { 
  accountId: string
  initialName: string
  canEdit: boolean 
}) {
  const [name, setName] = useState(initialName)
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  async function handleAction(e: React.FormEvent) {
    e.preventDefault()
    if (!canEdit) return

    setIsPending(true)
    setMessage('')
    setErrors({})
    
    const formData = new FormData()
    formData.append('accountId', accountId)
    formData.append('name', name)

    const result = await updateWorkspaceName(formData)
    
    if (result?.error) {
      setMessage(`Error: ${result.error}`)
      if (result.fieldErrors) setErrors(result.fieldErrors)
    } else if (result?.success) {
      setMessage(`Success: ${result.success}`)
    }
    
    setIsPending(false)
  }

  return (
    <form onSubmit={handleAction} className="space-y-4">
      <div>
        <label htmlFor="workspace-name" className="block text-sm font-medium text-foreground">
          Workspace Name
        </label>
        <input
          type="text"
          id="workspace-name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!canEdit || isPending}
          className="mt-1 block w-full sm:max-w-md rounded-md bg-surface border border-border px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm disabled:opacity-50"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
        )}
      </div>
      
      {canEdit && (
        <div>
          <button
            type="submit"
            disabled={isPending || name === initialName || !name.trim()}
            className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {message && (
        <p className={`text-sm mt-2 ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
          {message}
        </p>
      )}
    </form>
  )
}
