'use client'

import { useActionState } from 'react'
import { updateProfileAction } from './actions'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { UserCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const initialState: any = {}

interface ProfileFormProps {
  initialDisplayName: string
  initialAvatarUrl: string
}

export function ProfileForm({ initialDisplayName, initialAvatarUrl }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState)

  return (
    <Card glass className="max-w-2xl">
      <div className="flex items-center space-x-3 mb-6 border-b border-border pb-4">
        <UserCircleIcon className="w-8 h-8 text-primary" />
        <h2 className="text-xl font-semibold">Public Profile</h2>
      </div>

      <form action={formAction} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-medium text-foreground">
              Display Name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              defaultValue={initialDisplayName}
              className="w-full px-4 py-2 bg-surface text-foreground placeholder:text-muted-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
            {state?.fieldErrors?.display_name && (
              <p className="text-red-500 text-xs mt-1">{state.fieldErrors.display_name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="avatarUrl" className="text-sm font-medium text-foreground text-opacity-80">
              Avatar Image URL <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
            </label>
            <input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              defaultValue={initialAvatarUrl}
              placeholder="https://example.com/avatar.png"
              className="w-full px-4 py-2 bg-surface text-foreground placeholder:text-muted-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
            {state?.fieldErrors?.avatar_url && (
              <p className="text-red-500 text-xs mt-1">{state.fieldErrors.avatar_url[0]}</p>
            )}
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {state?.error && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-500 font-medium"
            >
              {state.error}
            </motion.div>
          )}

          {state?.success && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-green-500 font-medium flex items-center"
            >
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              {state.success}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
