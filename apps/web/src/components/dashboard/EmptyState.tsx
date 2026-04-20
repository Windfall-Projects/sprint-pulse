'use client'

import React from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PlusIcon } from '@heroicons/react/24/outline'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
      <div 
        className="w-16 h-16 bg-muted flex items-center justify-center mb-4 border border-border"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        <PlusIcon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      
      {actionLabel && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  )
}
