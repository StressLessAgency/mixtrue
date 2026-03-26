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
  setSupabaseUser: (supabaseUser: User | null) => void
  setLoading: (isLoading: boolean) => void
  logout: () => Promise<void>
  initialize: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>
}

function fallbackProfile(user: User): Profile {
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

async function fetchProfile(user: User): Promise<Profile> {
  try {
    // Use select('*') to avoid column-not-found errors
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Log for debugging (visible in browser console)
    if (error) {
      console.warn('[mixtrue] Profile fetch error:', error.message, error.code)
      return fallbackProfile(user)
    }

    if (!data) {
      console.warn('[mixtrue] No profile found for user:', user.id)
      return fallbackProfile(user)
    }

    console.log('[mixtrue] Profile loaded:', { role: data.role, plan: data.plan, email: data.email })

    return {
      id: data.id,
      email: data.email ?? user.email ?? '',
      full_name: data.full_name ?? user.user_metadata?.full_name ?? null,
      role: data.role ?? 'user',
      plan: data.plan ?? 'free',
      comp_type: data.comp_type ?? 'none',
      comp_expires_at: data.comp_expires_at ?? null,
      comp_granted_by: data.comp_granted_by ?? null,
      stripe_customer_id: data.stripe_customer_id ?? null,
      analyses_this_month: data.analyses_this_month ?? 0,
      created_at: data.created_at ?? user.created_at,
    }
  } catch (e) {
    console.error('[mixtrue] Profile fetch exception:', e)
    return fallbackProfile(user)
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
        const fb = fallbackProfile(session.user)
        set({ user: fb, supabaseUser: session.user, isAuthenticated: true, isLoading: false })
        const profile = await fetchProfile(session.user)
        set({ user: profile })
      } else {
        set({ user: null, supabaseUser: null, isAuthenticated: false, isLoading: false })
      }
    } catch {
      set({ user: null, supabaseUser: null, isAuthenticated: false, isLoading: false })
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const fb = fallbackProfile(session.user)
        set({ user: fb, supabaseUser: session.user, isAuthenticated: true, isLoading: false })
        const profile = await fetchProfile(session.user)
        set({ user: profile })
      } else {
        set({ user: null, supabaseUser: null, isAuthenticated: false, isLoading: false })
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
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  },

  signUpWithEmail: async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) throw error
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, supabaseUser: null, isAuthenticated: false })
  },
}))
