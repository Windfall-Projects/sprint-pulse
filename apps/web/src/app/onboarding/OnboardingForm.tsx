'use client'

import { useActionState } from 'react'
import { createWorkspaceAction } from './actions'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

const initialState = {
  error: null as string | null,
}

export default function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(createWorkspaceAction, initialState)

  return (
    <Card className="w-full relative overflow-hidden" glass>
      <form action={formAction} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="workspaceName" className="text-sm font-medium text-foreground">
              Workspace / Company Name
            </label>
            <input
              id="workspaceName"
              name="workspaceName"
              type="text"
              required
              placeholder="Acme Corp"
              className="w-full px-4 py-2 bg-surface text-foreground placeholder:text-muted-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
        </div>

        <AnimatePresence>
          {state?.error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-500 font-medium"
            >
              {state.error}
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Creating Workspace...' : 'Continue'}
        </Button>
      </form>
    </Card>
  )
}
