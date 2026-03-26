import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import type { Profile } from '@/types/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: Profile | null
  supabaseUser: User | null
  isAuthenticated: boolean
  isLoading: boolean

  setUser: (user: Profile | null) => void
  setSupabaseUser: (user: User | null) => void
  setLoading: (isLoading: boolean) => void
  logout: () => Promise<void>
  initialize: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>
}

function profileFromUser(user: User): Profile {
  return {
    id: user.id,
    email: user.email ?? '',
    full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    role: 'user',
    plan: 'free',
    stripe_customer_id: null,
    analyses_this_month: 0,
    created_at: user.created_at,
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  supabaseUser: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSupabaseUser: (supabaseUser) => set({ supabaseUser }),
  setLoading: (isLoading) => set({ isLoading }),

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const profile = profileFromUser(session.user)
        set({ user: profile, supabaseUser: session.user, isAuthenticated: true, isLoading: false })
      } else {
        set({ user: null, supabaseUser: null, isAuthenticated: false, isLoading: false })
      }
    } catch {
      set({ user: null, supabaseUser: null, isAuthenticated: false, isLoading: false })
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const profile = profileFromUser(session.user)
        set({ user: profile, supabaseUser: session.user, isAuthenticated: true })
      } else {
        set({ user: null, supabaseUser: null, isAuthenticated: false })
      }
    })
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/app/upload`,
      },
    })
    if (error) throw error
  },

  signInWithEmail: async (email: string, password: string) => {
    set({ isLoading: true })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    set({ isLoading: false })
    if (error) throw error
  },

  signUpWithEmail: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true })
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    set({ isLoading: false })
    if (error) throw error
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, supabaseUser: null, isAuthenticated: false })
  },
}))
