import { useState } from 'react'
import { createClient } from '../utils/supabase/client'
import toast from 'react-hot-toast'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const loginWithGoogle = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error('Could not connect to Google')
      setIsLoading(false)
    }
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error logging out')
    } else {
      window.location.href = '/login'
    }
  }

  return { loginWithGoogle, logout, isLoading }
}