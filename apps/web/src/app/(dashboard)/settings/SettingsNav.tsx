'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Profile', href: '/settings' },
  { name: 'Workspace', href: '/settings/workspace' },
  { name: 'Integrations', href: '/settings/integrations' },
]

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        // Exact match for /settings, prefix match for others (or exact)
        const isActive = 
          item.href === '/settings' 
            ? pathname === '/settings' 
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-surface hover:text-foreground'
            }`}
          >
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
