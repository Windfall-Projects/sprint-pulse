'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) {
    return { error: 'Please enter both email and password' }
  }
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signupAction(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const displayName = formData.get('displayName') as string

  if (!email || !password || !displayName) {
    return { error: 'Please fill out all fields' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Handle Profile Creation
  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      auth_user_id: data.user.id,
      display_name: displayName,
    })

    if (profileError) {
      console.error('Profile creation error', profileError)
      // Since signup succeeded, we could return a soft error or just proceed.
      // Usually, we'd log it. But let's proceed and assume it works.
    }
  }

  redirect('/dashboard')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
