"use client"
import { useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAppStore } from "@/store/useAppStore"

/**
 * AuthListener Component
 * Listens for Supabase Auth state changes and updates the global Zustand store.
 * Ensures the UI remains in sync with the current session.
 */
export default function AuthListener() {
  const supabase = createClient()
  const { setUser, setLoading, clearSession } = useAppStore()

  useEffect(() => {
    // Sync initial session
    const syncSession = async () => {
      setLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Fetch additional profile data from public.profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          setUser({
            id: session.user.id,
            email: session.user.email,
            display_name: profile?.display_name || session.user.user_metadata?.full_name || '',
            avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url || '',
            locale: profile?.locale || 'es',
          })
        } else {
          clearSession()
        }
      } catch (error) {
        console.error("Auth sync error:", error)
        clearSession()
      } finally {
        setLoading(false)
      }
    }

    syncSession()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          setUser({
            id: session.user.id,
            email: session.user.email,
            display_name: profile?.display_name || session.user.user_metadata?.full_name || '',
            avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url || '',
            locale: profile?.locale || 'es',
          })
        } else {
          clearSession()
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, setUser, setLoading, clearSession])

  return null
}
