import type {
  ReportData,
  StatusResponse,
  DeletionReceipt,
} from '@/types/analysis'
import { mockReport, mockStatusStages, mockDeletionReceipt } from './mockData'
import { supabase } from './supabase'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return {
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  }
}

const REST_URL = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1`

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

  saveReport: async (report: ReportData, userId: string): Promise<void> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(`${REST_URL}/analysis_sessions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          user_id: userId,
          track_name: report.trackName,
          file_format: report.fileFormat,
          file_size_mb: report.fileSizeMb,
          genre_mode: report.genreMode,
          analysis_mode: report.analysisMode,
          overall_score: report.overallScore,
          mixdown_score: report.mixdownScore,
          club_score: report.clubScore,
          master_score: report.masterScore,
          report_data: report,
          created_at: report.createdAt,
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        console.warn('[mixtrue] Failed to save report:', res.status, text)
      } else {
        console.log('[mixtrue] Report saved to history')
      }
    } catch (e) {
      console.warn('[mixtrue] Save report error:', e)
    }
  },

  getHistory: async (): Promise<{
    id: string
    trackName: string
    date: string
    genreMode: string
    analysisMode: string
    overallScore: number
    mixdownScore: number
    clubScore: number
    masterScore: number
  }[]> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(
        `${REST_URL}/analysis_sessions?select=id,track_name,genre_mode,analysis_mode,overall_score,mixdown_score,club_score,master_score,created_at&order=created_at.desc&limit=50`,
        { headers }
      )
      if (!res.ok) return []
      const data = await res.json()

      return (data ?? []).map((s: Record<string, unknown>) => ({
        id: s.id as string,
        trackName: (s.track_name as string) ?? 'Untitled',
        date: new Date(s.created_at as string).toLocaleDateString(),
        genreMode: (s.genre_mode as string) ?? 'unknown',
        analysisMode: (s.analysis_mode as string) ?? 'both',
        overallScore: (s.overall_score as number) ?? 0,
        mixdownScore: (s.mixdown_score as number) ?? 0,
        clubScore: (s.club_score as number) ?? 0,
        masterScore: (s.master_score as number) ?? 0,
      }))
    } catch {
      return []
    }
  },

  getSavedReport: async (sessionId: string): Promise<ReportData | null> => {
    try {
      const headers = await getAuthHeader()
      const res = await fetch(
        `${REST_URL}/analysis_sessions?id=eq.${sessionId}&select=report_data`,
        { headers }
      )
      if (!res.ok) return null
      const rows = await res.json()
      if (rows && rows.length > 0 && rows[0].report_data) {
        return rows[0].report_data as ReportData
      }
      return null
    } catch {
      return null
    }
  },
}
