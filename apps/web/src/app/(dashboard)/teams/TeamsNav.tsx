'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Your Teams', href: '/teams' },
  { name: 'Directory', href: '/teams/directory' },
]

export function TeamsNav() {
  const pathname = usePathname()

  return (
    <div className="border-b border-border/50 mb-8">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                ${isActive 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
