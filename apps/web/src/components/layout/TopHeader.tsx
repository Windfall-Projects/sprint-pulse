'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/ui/Input'

interface TopHeaderProps {
  breadcrumb?: { icon?: React.ReactNode; label: string }[]
}

export function TopHeader({ breadcrumb }: TopHeaderProps) {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 sticky top-0 z-40"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-6">
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-2">
            {breadcrumb.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                <div className={`flex items-center gap-1.5 ${i === breadcrumb.length - 1 ? 'text-primary font-semibold text-base' : 'text-muted-foreground text-base'}`}>
                  {crumb.icon}
                  <span>{crumb.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Right: search */}
      <div className="w-[349px]">
        <Input
          icon={<MagnifyingGlassIcon className="w-5 h-5" />}
          placeholder="Search"
          className="w-full"
        />
      </div>
    </motion.header>
  )
}
