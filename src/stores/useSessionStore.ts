import { create } from 'zustand'
import type { GenreMode, AnalysisMode, ProcessingStage, ReportData } from '@/types/analysis'

interface SessionState {
  genre: GenreMode | null
  analysisMode: AnalysisMode | null
  file: File | null
  referenceFile: File | null
  sessionId: string | null
  isProcessing: boolean
  isRealUpload: boolean
  processingStages: ProcessingStage[]
  currentStage: number
  progress: number
  currentOperation: string
  report: ReportData | null

  setGenre: (genre: GenreMode) => void
  setAnalysisMode: (mode: AnalysisMode) => void
  setFile: (file: File | null) => void
  setReferenceFile: (file: File | null) => void
  setSessionId: (id: string) => void
  setProcessing: (isProcessing: boolean) => void
  updateProcessingStage: (stage: number, progress: number, operation: string) => void
  setProcessingStages: (stages: ProcessingStage[]) => void
  setReport: (report: ReportData | null) => void
  reset: () => void
}

const initialState = {
  genre: null,
  analysisMode: null,
  file: null,
  referenceFile: null,
  sessionId: null,
  isProcessing: false,
  isRealUpload: false,
  processingStages: [],
  currentStage: 0,
  progress: 0,
  currentOperation: '',
  report: null,
}

export const useSessionStore = create<SessionState>((set) => ({
  ...initialState,
  setGenre: (genre) => set({ genre }),
  setAnalysisMode: (mode) => set({ analysisMode: mode }),
  setFile: (file) => set({ file }),
  setReferenceFile: (file) => set({ referenceFile: file }),
  setSessionId: (id) => set({ sessionId: id }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  updateProcessingStage: (stage, progress, operation) =>
    set({ currentStage: stage, progress, currentOperation: operation }),
  setProcessingStages: (stages) => set({ processingStages: stages }),
  setReport: (report) => set({ report }),
  reset: () => set(initialState),
}))
