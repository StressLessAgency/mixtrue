import { useAuthStore } from '@/stores/useAuthStore'

interface FeatureGate {
  isPro: boolean
  isLegendary: boolean
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

  const isLegendary = user?.plan === 'legendary'
  const isPro = user?.plan === 'pro' || isLegendary
  const analysesUsed = user?.analyses_this_month ?? 0
  const maxFreeAnalyses = 3

  return {
    isPro,
    isLegendary,
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
