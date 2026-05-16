'use client'

import { Card } from '@/components/ui/Card'
import { GiftIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { deleteKudos } from './actions'

export function KudosBoard({ kudos, currentProfileId }: { kudos: any[], currentProfileId?: string }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Delete this kudos?')) return
    setDeletingId(id)
    await deleteKudos(id)
    setDeletingId(null)
  }

  if (kudos.length === 0) {
    return (
      <Card glass className="p-12 text-center text-muted-foreground border-dashed text-sm">
        <GiftIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
        No kudos yet. Be the first to recognize a teammate!
      </Card>
    )
  }

  const categoryColors: Record<string, string> = {
    unblock: 'bg-red-500/10 text-red-400 border-red-500/20',
    support: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    technical_win: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    team_spirit: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kudos.map((k) => {
        const canDelete = currentProfileId && k.sender_profile_id === currentProfileId
        const catClass = k.category ? categoryColors[k.category] || categoryColors.team_spirit : categoryColors.team_spirit

        return (
          <Card key={k.id} glass className="p-6 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <GiftIcon className="w-24 h-24 rotate-12" />
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catClass}`}>
                {k.category ? k.category.replace('_', ' ') : 'Shoutout'}
              </span>
              
              {canDelete && (
                <button 
                  onClick={() => handleDelete(k.id)}
                  disabled={deletingId === k.id}
                  className="text-rose-400 hover:text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded"
                  title="Delete Kudos"
                  aria-label="Delete Kudos"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <p className="text-sm text-foreground/90 italic mb-6 relative z-10 leading-relaxed">
              "{k.message}"
            </p>

            <div className="flex items-center gap-2 pt-4 border-t border-white/5 relative z-10">
              <div className="flex-1 flex flex-col items-center">
                 <div className="text-[10px] text-muted-foreground uppercase mb-1 font-bold">From</div>
                 <div className="flex items-center gap-2">
                   {k.sender?.avatar_url ? (
                     <img src={k.sender.avatar_url} className="w-5 h-5 rounded-full" alt="" />
                   ) : (
                     <div className="w-5 h-5 rounded-full bg-surface-hover flex items-center justify-center text-[8px] font-bold text-primary">
                       {k.sender?.display_name?.substring(0,2).toUpperCase() || 'AN'}
                     </div>
                   )}
                   <span className="text-xs font-medium">{k.sender?.display_name || 'Anonymous'}</span>
                 </div>
              </div>
              <div className="text-muted-foreground/30 px-2">&rarr;</div>
              <div className="flex-1 flex flex-col items-center">
                 <div className="text-[10px] text-muted-foreground uppercase mb-1 font-bold">To</div>
                 <div className="flex items-center gap-2">
                   {k.receiver?.avatar_url ? (
                     <img src={k.receiver.avatar_url} className="w-5 h-5 rounded-full" alt="" />
                   ) : (
                     <div className="w-5 h-5 rounded-full bg-surface-hover flex items-center justify-center text-[8px] font-bold text-emerald-400">
                       {k.receiver?.display_name?.substring(0,2).toUpperCase() || 'AN'}
                     </div>
                   )}
                   <span className="text-xs font-medium">{k.receiver?.display_name || 'Anonymous'}</span>
                 </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
