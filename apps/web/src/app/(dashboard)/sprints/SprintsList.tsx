'use client'

import { Card } from '@/components/ui/Card'
import { MapIcon } from '@heroicons/react/24/outline'

export function SprintsList({ sprints, selectedTeamId }: { sprints: any[], selectedTeamId: string }) {
  if (sprints.length === 0) {
    return (
      <Card glass className="p-8 text-center text-muted-foreground border-dashed">
        No sprints found for this team. Create one to get started!
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sprints.map((sprint) => (
        <Card key={sprint.id} glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg text-primary">
                <MapIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground">{sprint.name}</h3>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              sprint.status === 'active' ? 'bg-primary/20 text-primary border border-primary/30' :
              sprint.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
              'bg-surface border border-white/10 text-muted-foreground'
            }`}>
              {sprint.status}
            </span>
          </div>
          
          <p className="text-sm text-foreground/80 mb-4 line-clamp-2 min-h-[40px]">
            {sprint.goal || 'No sprint goal set.'}
          </p>

          <div className="flex justify-between text-xs text-muted-foreground bg-surface/50 p-2 rounded mb-4">
            <span>{sprint.start_date}</span>
            <span>&rarr;</span>
            <span>{sprint.end_date}</span>
          </div>

          <button className="w-full bg-surface border border-white/10 text-foreground py-2 text-sm font-medium rounded-md hover:bg-white/5 transition-colors">
             View Board
          </button>
        </Card>
      ))}
    </div>
  )
}
