import { create } from 'zustand'
import type { Profile } from '@/types/supabase'

interface AuthState {
  user: Profile | null
  isAuthenticated: boolean
  isLoading: boolean

  setUser: (user: Profile | null) => void
  setLoading: (isLoading: boolean) => void
  logout: () => void
}

const mockUser: Profile = {
  id: 'mock-user-001',
  email: 'producer@example.com',
  full_name: 'Alex Producer',
  role: 'user',
  plan: 'free',
  stripe_customer_id: null,
  analyses_this_month: 2,
  created_at: new Date().toISOString(),
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
