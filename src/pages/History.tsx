import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Info } from 'lucide-react'
import PageTransition from '@/components/layout/PageTransition'
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

export default function History() {
  const [sessions, setSessions] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [compareOpen, setCompareOpen] = useState(false)
  const [compareIdx, setCompareIdx] = useState<number | null>(null)

  useEffect(() => {
    analysisApi.getHistory()
      .then(setSessions)
      .finally(() => setLoading(false))
  }, [])

  const latest = sessions[0] ?? null
  const compareTarget = compareIdx !== null ? sessions[compareIdx] : null

  if (loading) {
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-12 text-center">
            <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-text-muted font-mono">Loading history...</p>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-text-primary">Track History</h1>
            <p className="text-sm text-text-secondary mt-1">
              {sessions.length > 0
                ? `${sessions.length} analysis${sessions.length !== 1 ? 'es' : ''} on record.`
                : 'No analyses yet. Upload your first track to get started.'}
            </p>
          </div>
          <Link to="/app/upload">
            <Button size="md">
              <Plus className="w-4 h-4" />
              Analyze Track
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
          <div className="space-y-4">
            {sessions.map((session, i) => (
              <RevisionCard
                key={session.id}
                id={session.id}
                trackName={session.trackName}
                version={`V${sessions.length - i}`}
                date={session.date}
                genreMode={session.genreMode}
                analysisMode={session.analysisMode}
                mixdownScore={session.mixdownScore}
                clubScore={session.clubScore}
                masterScore={session.masterScore}
                onCompare={i > 0 ? () => { setCompareIdx(i); setCompareOpen(true) } : undefined}
              />
            ))}
          </div>
        )}

        <div className="flex items-start gap-2 mt-8 p-4 glass-card border-border-accent">
          <Info className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary">
            Only your scores and metadata are stored — never your audio files.
          </p>
        </div>

        {latest && (
          <ComparisonModal
            open={compareOpen}
            onClose={() => setCompareOpen(false)}
            v1={compareTarget ? { version: `V${sessions.length - (compareIdx ?? 0)}`, mixdownScore: compareTarget.mixdownScore, clubScore: compareTarget.clubScore, masterScore: compareTarget.masterScore } : null}
            v2={{ version: `V${sessions.length}`, mixdownScore: latest.mixdownScore, clubScore: latest.clubScore, masterScore: latest.masterScore }}
          />
        )}
      </div>
    </PageTransition>
  )
}
