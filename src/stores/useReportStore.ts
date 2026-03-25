import { create } from 'zustand'
import type { ReportData } from '@/types/analysis'

interface ReportState {
  report: ReportData | null
  isLoading: boolean
  error: string | null

  setReport: (report: ReportData) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useReportStore = create<ReportState>((set) => ({
  report: null,
  isLoading: false,
  error: null,

  setReport: (report) => set({ report, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set({ report: null, isLoading: false, error: null }),
}))
