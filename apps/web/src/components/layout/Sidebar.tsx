'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Squares2X2Icon,
  UserGroupIcon,
  ArrowPathIcon,
  BriefcaseIcon,
  PresentationChartLineIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline'

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: Squares2X2Icon },
  { name: 'People', href: '/teams', icon: UserGroupIcon },
  { name: 'Sprints', href: '/sprints', icon: ArrowPathIcon },
  { name: 'Projects', href: '/projects', icon: BriefcaseIcon },
  { name: 'Metrics', href: '/analytics', icon: PresentationChartLineIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

interface SidebarProps {
  userName?: string
  avatarUrl?: string
}

export function Sidebar({ userName, avatarUrl }: SidebarProps) {
  const pathname = usePathname()

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-[243px] border-r border-border bg-surface hidden md:flex flex-col h-full sticky top-0"
    >
      {/* Brand */}
      <div className="px-4 pt-6 pb-4">
        <Link 
          href="/dashboard" 
          className="flex items-center px-2.5 font-semibold text-base text-primary"
        >
          Sprint Pulse
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 transition-colors relative group`}
              style={{ borderRadius: 'var(--radius-pill)' }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-surface border border-primary"
                  style={{ 
                    borderRadius: 'var(--radius-pill)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className={`w-6 h-6 relative z-10 ${isActive ? 'text-primary' : 'text-foreground'}`} />
              <span className={`relative z-10 text-base ${
                isActive ? 'text-primary' : 'text-foreground'
              }`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-4 space-y-6">
        {/* Support & Feedback links */}
        <div className="space-y-2">
          <a href="#" className="flex items-center gap-1.5 px-2.5 text-sm text-foreground hover:text-primary transition-colors">
            <LifebuoyIcon className="w-6 h-6" />
            <span>Support</span>
          </a>
          <a href="#" className="flex items-center gap-1.5 px-2.5 text-sm text-foreground hover:text-primary transition-colors">
            <PaperAirplaneIcon className="w-6 h-6" />
            <span>Feedback</span>
          </a>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2.5 px-2.5">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              className="h-10 w-10 rounded-full object-cover shrink-0" 
            />
          ) : (
            <div 
              className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium text-sm shrink-0"
            >
              {userName ? userName.substring(0, 2).toUpperCase() : 'U'}
            </div>
          )}
          {userName && (
            <span className="text-base text-foreground truncate">
              {userName}
            </span>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
