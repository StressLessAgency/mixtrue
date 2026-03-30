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

  /** Save a completed report to Supabase analysis_sessions */
  saveReport: async (report: ReportData, userId?: string): Promise<void> => {
    try {
      const { error } = await supabase.from('analysis_sessions').insert({
        id: report.sessionId,
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
        report_data: report as unknown as Record<string, unknown>,
        created_at: report.createdAt,
      })
      if (error) {
        console.warn('[mixtrue] Failed to save report:', error.message)
      } else {
        console.log('[mixtrue] Report saved to history')
      }
    } catch (e) {
      console.warn('[mixtrue] Save report error:', e)
    }
  },

  /** Fetch analysis history for the current user */
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
      const { data, error } = await supabase
        .from('analysis_sessions')
        .select('id, track_name, genre_mode, analysis_mode, overall_score, mixdown_score, club_score, master_score, created_at')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error || !data) return []

      return data.map((s) => ({
        id: s.id,
        trackName: s.track_name ?? 'Untitled',
        date: new Date(s.created_at).toLocaleDateString(),
        genreMode: s.genre_mode ?? 'unknown',
        analysisMode: s.analysis_mode ?? 'both',
        overallScore: s.overall_score ?? 0,
        mixdownScore: s.mixdown_score ?? 0,
        clubScore: s.club_score ?? 0,
        masterScore: s.master_score ?? 0,
      }))
    } catch {
      return []
    }
  },

  /** Fetch a saved report by session ID */
  getSavedReport: async (sessionId: string): Promise<ReportData | null> => {
    try {
      const { data, error } = await supabase
        .from('analysis_sessions')
        .select('report_data')
        .eq('id', sessionId)
        .single()

      if (error || !data?.report_data) return null
      return data.report_data as unknown as ReportData
    } catch {
      return null
    }
  },
}
