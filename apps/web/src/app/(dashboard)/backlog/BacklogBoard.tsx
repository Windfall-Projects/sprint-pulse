'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { CreateWorkItemModal } from './CreateWorkItemModal'
import { PlusIcon } from '@heroicons/react/24/outline'

export function BacklogBoard({
  teams,
  selectedTeamId,
  initialWorkItems,
  accountId
}: {
  teams: { id: string, name: string }[]
  selectedTeamId: string
  initialWorkItems: any[]
  accountId: string
}) {
  const router = useRouter()
  
  // Minimal drag & drop state or just a list for MVP
  const backlogItems = initialWorkItems.filter(i => !i.sprint_id)
  
  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4 bg-surface p-3 rounded-lg border border-border">
        <label className="text-sm text-muted-foreground font-medium">Team:</label>
        <select 
          className="bg-transparent border-none text-sm text-foreground focus:ring-0 cursor-pointer"
          value={selectedTeamId}
          onChange={(e) => router.push(`/backlog?team=${e.target.value}`)}
        >
          {teams.map(t => (
            <option key={t.id} value={t.id} className="bg-surface">{t.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
        {/* Backlog Column */}
        <div className="flex flex-col h-full rounded-xl bg-surface/30 border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between bg-surface/50">
            <h3 className="font-bold">Product Backlog</h3>
            <span className="text-xs bg-surface px-2 py-1 rounded-full text-muted-foreground">
              {backlogItems.length} items
            </span>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
             {backlogItems.map(item => (
                <Card key={item.id} className="p-3 hover:border-primary/50 transition-colors cursor-pointer group relative">
                   <div className="flex justify-between mb-2 items-start gap-2">
                     <div className="flex gap-2 items-center flex-wrap">
                       <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                         item.type === 'bug' ? 'bg-red-500/10 text-red-400' :
                         item.type === 'story' ? 'bg-emerald-500/10 text-emerald-400' :
                         item.type === 'task' ? 'bg-blue-500/10 text-blue-400' :
                         'bg-gray-500/10 text-gray-400'
                       }`}>
                         {item.type}
                       </span>
                       {item.provider === 'github' && (
                         <a 
                           href={item.external_url || '#'} 
                           target="_blank" 
                           rel="noreferrer"
                           onClick={(e) => e.stopPropagation()}
                           className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2da44e]/10 text-[#2da44e] hover:bg-[#2da44e]/20 transition-colors"
                         >
                           <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                           {item.external_id ? `#${item.external_id}` : 'GitHub'}
                         </a>
                       )}
                     </div>
                     <span className="text-xs font-mono bg-surface px-1.5 rounded text-muted-foreground whitespace-nowrap">
                       {item.story_points} pts
                     </span>
                   </div>
                   <h4 className="text-sm font-medium leading-tight mb-1">{item.title}</h4>
                   <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                </Card>
             ))}
             
             <CreateWorkItemModal teamId={selectedTeamId} accountId={accountId} />
          </div>
        </div>

        {/* Future: Sprint Planning Column or Next Up */}
        <div className="flex flex-col h-full rounded-xl bg-surface/30 border border-border overflow-hidden hidden lg:flex">
          <div className="p-4 border-b border-border flex items-center justify-between bg-surface/50">
            <h3 className="font-bold text-muted-foreground">Active Sprint (Preview)</h3>
          </div>
          <div className="p-4 flex-1 flex items-center justify-center text-center text-muted-foreground">
            <p>Go to the Sprints page to plan and <br/>start your active sprint.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
