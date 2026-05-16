'use client'

import { Card } from '@/components/ui/Card'
import { UsersIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import Link from 'next/link'
import { deleteTeam } from './actions'

export function TeamsList({ teams }: { teams: any[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this team? This is a soft delete, but will hide it from view.')) {
      return
    }
    setDeletingId(id)
    await deleteTeam(id)
    setDeletingId(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <Card key={team.id} glass className="p-6 relative group">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 p-2 rounded-lg text-primary">
                <UsersIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">{team.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Created {new Date(team.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-2">
            <Link href="/teams/directory" className="flex-1 bg-surface border border-white/10 text-center text-foreground py-2 text-sm font-medium rounded-md hover:bg-white/5 transition-colors">
              Manage Members
            </Link>
            <button 
              onClick={() => handleDelete(team.id)}
              disabled={deletingId === team.id}
              className="px-3 bg-red-500/10 text-red-400 border border-red-500/20 py-2 rounded-md hover:bg-red-500/20 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              title="Delete Team"
              aria-label="Delete Team"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  )
}
