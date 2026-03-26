import type {
  AnalysisPayload,
  SessionResponse,
  StatusResponse,
  ReportData,
  DeletionReceipt,
} from '@/types/analysis'
import { mockReport, mockStatusStages, mockDeletionReceipt } from './mockData'

const API_BASE = import.meta.env.VITE_ANALYSIS_API_URL || 'https://api.mixtrue-ai.com/v1'
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true'
const REQUEST_TIMEOUT_MS = 30_000

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit & { timeout?: number }): Promise<Response> {
  const { timeout = REQUEST_TIMEOUT_MS, ...fetchInit } = init ?? {}
  const controller = new AbortController()
  if (fetchInit.signal) {
    fetchInit.signal.addEventListener('abort', () => controller.abort())
  }
  const id = setTimeout(() => controller.abort(), timeout)
  return fetch(input, { ...fetchInit, signal: controller.signal })
    .catch((err) => {
      if (err.name === 'AbortError') throw new Error('Request timed out')
      throw err
    })
    .finally(() => clearTimeout(id))
}

export const analysisApi = {
  startAnalysis: async (_payload: AnalysisPayload): Promise<SessionResponse> => {
    if (USE_MOCK) {
      await delay(800)
      return {
        sessionId: mockReport.sessionId,
        estimatedSeconds: 45,
      }
    }

    const formData = new FormData()
    formData.append('file', _payload.file)
    formData.append('genre', _payload.genre)
    formData.append('mode', _payload.mode)
    if (_payload.referenceFile) {
      formData.append('reference_file', _payload.referenceFile)
    }

    const res = await fetchWithTimeout(`${API_BASE}/analyze`, {
      method: 'POST',
      body: formData,
      timeout: 60_000,
    })

    if (!res.ok) throw new Error(`Analysis API error: ${res.status}`)
    return res.json() as Promise<SessionResponse>
  },

  getStatus: async (sessionId: string): Promise<StatusResponse> => {
    if (USE_MOCK) {
      await delay(300)
      return { ...mockStatusStages }
    }

    const res = await fetchWithTimeout(`${API_BASE}/status/${sessionId}`)
    if (!res.ok) throw new Error(`Status API error: ${res.status}`)
    return res.json() as Promise<StatusResponse>
  },

  getReport: async (sessionId: string): Promise<ReportData> => {
    if (USE_MOCK) {
      await delay(600)
      return { ...mockReport, sessionId }
    }

    const res = await fetchWithTimeout(`${API_BASE}/report/${sessionId}`)
    if (!res.ok) throw new Error(`Report API error: ${res.status}`)
    return res.json() as Promise<ReportData>
  },

  confirmDeletion: async (sessionId: string): Promise<DeletionReceipt> => {
    if (USE_MOCK) {
      await delay(400)
      return { ...mockDeletionReceipt, sessionId }
    }

    const res = await fetchWithTimeout(`${API_BASE}/deletion-receipt/${sessionId}`)
    if (!res.ok) throw new Error(`Deletion API error: ${res.status}`)
    return res.json() as Promise<DeletionReceipt>
  },
}
