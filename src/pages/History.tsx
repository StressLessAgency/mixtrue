import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Info } from 'lucide-react'
import PageTransition from '@/components/layout/PageTransition'
import LoadingScreen from '@/components/LoadingScreen'
import { Button } from '@/components/ui/button'
import RevisionCard from '@/components/history/RevisionCard'
import ComparisonModal from '@/components/history/ComparisonModal'
import { analysisApi } from '@/services/analysisApi'

interface HistoryEntry {
  id: string
  trackName: string
  date: string
  genreMode: string
  analysisMode: string
  overallScore: number
  mixdownScore: number
  clubScore: number
  masterScore: number
}

interface TrackGroup {
  trackName: string
  sessions: HistoryEntry[]
}

export default function History() {
  const [sessions, setSessions] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [compareOpen, setCompareOpen] = useState(false)
  const [compareData, setCompareData] = useState<{ v1: HistoryEntry; v2: HistoryEntry; v1Label: string; v2Label: string } | null>(null)

  useEffect(() => {
    analysisApi.getHistory()
      .then(setSessions)
      .finally(() => setLoading(false))
  }, [])

  // Group sessions by track name — each unique track gets its own section
  // Sessions within a track are ordered newest-first (from the API)
  const groups = useMemo<TrackGroup[]>(() => {
    const map = new Map<string, HistoryEntry[]>()
    for (const s of sessions) {
      const key = s.trackName.trim().toLowerCase()
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    }
    // Return groups ordered by most recent session first
    return Array.from(map.values()).map((entries) => ({
      trackName: entries[0].trackName,
      sessions: entries,
    }))
  }, [sessions])

  if (loading) {
    return <LoadingScreen message="Loading history..." />
  }

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-text-primary">Track History</h1>
            <p className="text-sm text-text-secondary mt-1">
              {sessions.length > 0
                ? `${sessions.length} analysis${sessions.length !== 1 ? 'es' : ''} across ${groups.length} track${groups.length !== 1 ? 's' : ''}.`
                : 'No analyses yet. Upload your first track to get started.'}
            </p>
          </div>
          <Link to="/app/upload">
            <Button size="md">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Analyze Track</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-4">
            <p className="text-text-secondary">Your analysis history will appear here after you upload and analyze a track.</p>
            <Link to="/app/upload">
              <Button variant="primary" size="md">
                <Plus className="w-4 h-4" />
                Upload Your First Track
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map((group) => {
              const hasVersions = group.sessions.length > 1
              return (
                <div key={group.trackName}>
                  {/* Track group header — only show if multiple tracks exist */}
                  {groups.length > 1 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 rounded-full bg-accent-cyan" />
                      <h2 className="font-display font-semibold text-sm text-text-primary truncate">{group.trackName}</h2>
                      {hasVersions && (
                        <span className="text-[10px] font-mono text-text-muted">
                          {group.sessions.length} versions
                        </span>
                      )}
                    </div>
                  )}
                  <div className="space-y-3">
                    {group.sessions.map((session, i) => {
                      // Version numbering: oldest = V1, newest = highest
                      const versionNum = group.sessions.length - i
                      return (
                        <RevisionCard
                          key={session.id}
                          id={session.id}
                          trackName={session.trackName}
                          version={hasVersions ? `V${versionNum}` : undefined}
                          date={session.date}
                          genreMode={session.genreMode}
                          analysisMode={session.analysisMode}
                          mixdownScore={session.mixdownScore}
                          clubScore={session.clubScore}
                          masterScore={session.masterScore}
                          onCompare={hasVersions && i < group.sessions.length - 1 ? () => {
                            // Compare this version with the latest (index 0) in the same track group
                            const latest = group.sessions[0]
                            setCompareData({
                              v1: session,
                              v2: latest,
                              v1Label: `V${versionNum}`,
                              v2Label: `V${group.sessions.length}`,
                            })
                            setCompareOpen(true)
                          } : undefined}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex items-start gap-2 mt-8 p-4 glass-card border-border-accent">
          <Info className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary">
            Only your scores and metadata are stored — never your audio files.
          </p>
        </div>

        {compareData && (
          <ComparisonModal
            open={compareOpen}
            onClose={() => setCompareOpen(false)}
            v1={{ version: compareData.v1Label, mixdownScore: compareData.v1.mixdownScore, clubScore: compareData.v1.clubScore, masterScore: compareData.v1.masterScore }}
            v2={{ version: compareData.v2Label, mixdownScore: compareData.v2.mixdownScore, clubScore: compareData.v2.clubScore, masterScore: compareData.v2.masterScore }}
          />
        )}
      </div>
    </PageTransition>
  )
}
