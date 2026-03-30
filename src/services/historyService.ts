import type { ReportData } from '@/types/analysis'

export interface HistoryEntry {
  id: string
  trackName: string
  version: string
  date: string
  genreMode: string
  analysisMode: string
  overallScore: number
  mixdownScore: number
  clubScore: number
  masterScore: number
  fileFormat: string
  fileSizeMb: number
  createdAt: string
}

const STORAGE_KEY = 'mixtrue_history'
const MAX_ENTRIES = 50

function getAll(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as HistoryEntry[]
  } catch {
    return []
  }
}

function saveAll(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

export function saveReport(report: ReportData): void {
  const entries = getAll()

  // Derive a version label: "v" + (entries for same trackName count + 1)
  const sameTrack = entries.filter((e) => e.trackName === report.trackName)
  const versionNum = sameTrack.length + 1
  const version = `v${versionNum}`

  const entry: HistoryEntry = {
    id: report.sessionId,
    trackName: report.trackName,
    version,
    date: new Date(report.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    genreMode: report.genreMode,
    analysisMode: report.analysisMode,
    overallScore: report.overallScore,
    mixdownScore: report.mixdownScore,
    clubScore: report.clubScore,
    masterScore: report.masterScore,
    fileFormat: report.fileFormat,
    fileSizeMb: report.fileSizeMb,
    createdAt: report.createdAt,
  }

  // Prepend newest first, dedupe by id, cap at MAX_ENTRIES
  const deduped = [entry, ...entries.filter((e) => e.id !== entry.id)]
  saveAll(deduped.slice(0, MAX_ENTRIES))
}

export function getHistory(): HistoryEntry[] {
  return getAll()
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function deleteEntry(id: string): void {
  const entries = getAll().filter((e) => e.id !== id)
  saveAll(entries)
}
