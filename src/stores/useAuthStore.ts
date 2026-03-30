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

function profileFromUser(user: User, dbData?: Record<string, unknown> | null): Profile {
  if (dbData) {
    return {
      id: String(dbData.id ?? user.id),
      email: String(dbData.email ?? user.email ?? ''),
      full_name: dbData.full_name as string | null ?? user.user_metadata?.full_name ?? null,
      role: (dbData.role as 'user' | 'admin') ?? 'user',
      plan: (dbData.plan as 'free' | 'pro' | 'legendary') ?? 'free',
      comp_type: (dbData.comp_type as 'none' | 'lifetime' | 'timed') ?? 'none',
      comp_expires_at: dbData.comp_expires_at as string | null ?? null,
      comp_granted_by: dbData.comp_granted_by as string | null ?? null,
      stripe_customer_id: dbData.stripe_customer_id as string | null ?? null,
      analyses_this_month: (dbData.analyses_this_month as number) ?? 0,
      created_at: String(dbData.created_at ?? user.created_at),
    }
  }
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

async function loadProfile(user: User): Promise<Profile> {
  // Try to fetch from Supabase with a short timeout
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=*`,
      {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }
    )

    clearTimeout(timeout)

    if (!response.ok) {
      console.warn('[mixtrue] Profile API error:', response.status)
      return profileFromUser(user)
    }

    const rows = await response.json()
    if (rows && rows.length > 0) {
      console.log('[mixtrue] Profile loaded:', { role: rows[0].role, plan: rows[0].plan, email: rows[0].email })
      return profileFromUser(user, rows[0])
    }

    console.warn('[mixtrue] No profile row found')
    return profileFromUser(user)
  } catch (e) {
    console.warn('[mixtrue] Profile fetch failed:', e instanceof Error ? e.message : e)
    return profileFromUser(user)
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
        // Authenticate immediately with basic profile
        const basic = profileFromUser(session.user)
        set({ user: basic, supabaseUser: session.user, isAuthenticated: true, isLoading: false })
        // Then upgrade with real profile from DB
        const full = await loadProfile(session.user)
        set({ user: full })
      } else {
        set({ user: null, supabaseUser: null, isAuthenticated: false, isLoading: false })
      }
    } catch {
      set({ user: null, supabaseUser: null, isAuthenticated: false, isLoading: false })
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const basic = profileFromUser(session.user)
        set({ user: basic, supabaseUser: session.user, isAuthenticated: true, isLoading: false })
        const full = await loadProfile(session.user)
        set({ user: full })
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
