import type {
  ReportData,
  StatusResponse,
  DeletionReceipt,
} from '@/types/analysis'
import { mockReport, mockStatusStages, mockDeletionReceipt } from './mockData'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const analysisApi = {
  getStatus: async (_sessionId: string): Promise<StatusResponse> => {
    await delay(300)
    return { ...mockStatusStages }
  },

  getReport: async (sessionId: string): Promise<ReportData> => {
    await delay(600)
    return { ...mockReport, sessionId }
  },

  confirmDeletion: async (sessionId: string): Promise<DeletionReceipt> => {
    await delay(400)
    return { ...mockDeletionReceipt, sessionId }
  },
}
