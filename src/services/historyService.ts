import { supabase } from './supabase'
import type { ReportData, GenreMode, AnalysisMode } from '@/types/analysis'

const HISTORY_KEY = 'mixtrue_history_v1'
const MAX_LOCAL_SESSIONS = 50

export interface HistorySession {
  id: string
  trackName: string
  version: string
  date: string
  genreMode: GenreMode
  analysisMode: AnalysisMode
  mixdownScore: number
  clubScore: number
  masterScore: number
}

// --- Local Storage --------------------------------------------------------

function readLocalHistory(): HistorySession[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeLocalHistory(sessions: HistorySession[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sessions.slice(0, MAX_LOCAL_SESSIONS)))
  } catch {
    // localStorage full or unavailable -- silent fail, history is non-critical
  }
}

function buildVersionLabel(sessions: HistorySession[], trackName: string): string {
  const sameTrack = sessions.filter((s) => s.trackName === trackName)
  return `V${sameTrack.length + 1}`
}

// --- Supabase Sync --------------------------------------------------------

async function syncToSupabase(
  report: ReportData,
  userId: string | undefined
): Promise<void> {
  if (!userId) return

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
      deletion_confirmed_at: report.deletionReceipt?.deletedAt ?? null,
      deletion_receipt_id: report.deletionReceipt?.receiptId ?? null,
    })

    if (error) {
      // Non-critical -- local history is the source of truth for now
      console.warn('[historyService] Supabase sync failed:', error.message)
    }
  } catch (err) {
    console.warn('[historyService] Supabase sync error:', err)
  }
}

// --- Public API -----------------------------------------------------------

/**
 * Persist a completed analysis to local history (and optionally Supabase).
 * Call this immediately after a successful analysis.
 */
export async function saveAnalysisToHistory(
  report: ReportData,
  userId?: string
): Promise<void> {
  const existing = readLocalHistory()

  const session: HistorySession = {
    id: report.sessionId,
    trackName: report.trackName,
    version: buildVersionLabel(existing, report.trackName),
    date: new Date().toISOString().split('T')[0],
    genreMode: report.genreMode,
    analysisMode: report.analysisMode,
    mixdownScore: report.mixdownScore,
    clubScore: report.clubScore,
    masterScore: report.masterScore,
  }

  // Prepend so newest is first
  writeLocalHistory([session, ...existing])

  // Best-effort Supabase sync (fire-and-forget, does not block UI)
  void syncToSupabase(report, userId)
}

/**
 * Load history sessions, newest first.
 * Falls back to an empty array if nothing is stored.
 */
export function loadHistory(): HistorySession[] {
  return readLocalHistory()
}

/**
 * Persist the full report JSON to sessionStorage so it survives a page refresh
 * within the same browser session.
 */
export function persistReportForSession(report: ReportData): void {
  try {
    sessionStorage.setItem(`mixtrue_report_${report.sessionId}`, JSON.stringify(report))
  } catch {
    // sessionStorage full -- non-critical
  }
}

/**
 * Retrieve a report from sessionStorage by sessionId.
 * Returns null if not found or on parse error.
 */
export function loadReportFromSession(sessionId: string): ReportData | null {
  try {
    const raw = sessionStorage.getItem(`mixtrue_report_${sessionId}`)
    if (!raw) return null
    return JSON.parse(raw) as ReportData
  } catch {
    return null
  }
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY)
}
