'use client'

import { Card } from '@/components/ui/Card'
import { FolderIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { deleteProject } from './actions'

export function ProjectsList({ projects }: { projects: any[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }
    setDeletingId(id)
    await deleteProject(id)
    setDeletingId(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} glass className="p-6 relative group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                  <FolderIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{project.name}</h3>
                  <div className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-surface border border-border uppercase tracking-wider text-muted-foreground mr-2">
                    {project.status || 'Active'}
                  </div>
                </div>
              </div>
              <p className="text-sm text-foreground/80 mt-2 line-clamp-2">
                {project.description || 'No description provided.'}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-muted-foreground bg-surface/50 px-2 py-1 rounded">
                  Team: {project.teams?.name || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-2">
             <button className="flex-1 bg-surface border border-border text-foreground py-2 text-sm font-medium rounded-md hover:bg-surface-hover transition-colors">
              Manage Backlog
            </button>
            <button 
              onClick={() => handleDelete(project.id)}
              disabled={deletingId === project.id}
              className="px-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 py-2 rounded-md hover:bg-rose-500/20 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              title="Delete Project"
              aria-label="Delete Project"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  )
}
