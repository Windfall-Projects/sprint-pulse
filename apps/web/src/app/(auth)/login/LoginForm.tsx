'use client'

import { useActionState } from 'react'
import { loginAction } from '../actions'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const initialState = {
  error: null as string | null,
}

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <Card className="w-full relative overflow-hidden" glass>
      <form action={formAction} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              className="w-full px-4 py-2 bg-surface text-foreground placeholder:text-muted-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
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
          {isPending ? 'Signing In...' : 'Sign In'}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:text-primary-hover transition-colors">
            Create account
          </Link>
        </div>
      </form>
    </Card>
  )
}
