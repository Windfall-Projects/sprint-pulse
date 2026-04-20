'use client'

import { useRouter } from 'next/navigation'

export function TeamSelector({ 
  teams, 
  selectedTeamId 
}: { 
  teams: { id: string, name: string }[]
  selectedTeamId: string
}) {
  const router = useRouter()

  return (
    <div 
      className="flex items-center gap-3 bg-surface border border-border px-4 py-2.5 w-fit"
      style={{ borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-sm)' }}
    >
      <label className="text-sm text-muted-foreground font-medium shrink-0">Team:</label>
      <select 
        name="team"
        className="bg-transparent border-none text-sm text-foreground focus:ring-0 cursor-pointer outline-none"
        value={selectedTeamId}
        onChange={(e) => {
          const params = new URLSearchParams(window.location.search)
          params.set('team', e.target.value)
          router.push(`?${params.toString()}`)
        }}
      >
        {teams.map(t => (
          <option key={t.id} value={t.id} className="bg-surface">{t.name}</option>
        ))}
      </select>
    </div>
  )
}
