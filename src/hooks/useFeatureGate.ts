import { useAuthStore } from '@/stores/useAuthStore'

interface FeatureGate {
  isPro: boolean
  isLegendary: boolean
  isComped: boolean
  canAnalyze: boolean
  analysesRemaining: number
  canAccessClub: boolean
  canAccessMaster: boolean
  canAccessAiFixes: boolean
  canAccessReferenceTrack: boolean
  canAccessHistory: boolean
  hasWatermark: boolean
}

export function useFeatureGate(): FeatureGate {
  const user = useAuthStore((s) => s.user)

  // Check if comp is still valid
  const compActive = user?.comp_type === 'lifetime' ||
    (user?.comp_type === 'timed' && user?.comp_expires_at && new Date(user.comp_expires_at) > new Date())

  // If comp expired, treat as free regardless of stored plan
  const effectivePlan = (user?.comp_type === 'timed' && !compActive) ? 'free' : (user?.plan ?? 'free')

  const isLegendary = effectivePlan === 'legendary'
  const isPro = effectivePlan === 'pro' || isLegendary
  const isComped = compActive === true
  const analysesUsed = user?.analyses_this_month ?? 0
  const maxFreeAnalyses = 3

  return {
    isPro,
    isLegendary,
    isComped,
    canAnalyze: isPro || analysesUsed < maxFreeAnalyses,
    analysesRemaining: isPro ? Infinity : Math.max(0, maxFreeAnalyses - analysesUsed),
    canAccessClub: isPro,
    canAccessMaster: isPro,
    canAccessAiFixes: isPro,
    canAccessReferenceTrack: isPro,
    canAccessHistory: isPro,
    hasWatermark: !isPro,
  }
}
