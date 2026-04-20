'use client'

import React from 'react'
import { motion } from 'framer-motion'

type StatColor = 'teal' | 'blue' | 'amber' | 'pink'

export interface StatCardProps {
  title: string
  value: string | number
  color?: StatColor
}

const colorMap: Record<StatColor, { bg: string; fg: string }> = {
  teal:  { bg: 'var(--stat-teal)',  fg: 'var(--stat-teal-fg)'  },
  blue:  { bg: 'var(--stat-blue)',  fg: 'var(--stat-blue-fg)'  },
  amber: { bg: 'var(--stat-amber)', fg: 'var(--stat-amber-fg)' },
  pink:  { bg: 'var(--stat-pink)',  fg: 'var(--stat-pink-fg)'  },
}

export function StatCard({ title, value, color = 'teal' }: StatCardProps) {
  const { bg, fg } = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-start justify-center px-4 py-3 whitespace-nowrap"
      style={{ 
        backgroundColor: bg, 
        color: fg, 
        borderRadius: 'var(--radius-lg)' 
      }}
    >
      <p
        className="font-black italic text-5xl leading-none"
        style={{ fontFamily: 'var(--font-display), ui-sans-serif' }}
      >
        {value}
      </p>
      <p className="text-base mt-1">
        {title}
      </p>
    </motion.div>
  )
}
