import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Info, Trash2 } from 'lucide-react'
import PageTransition from '@/components/layout/PageTransition'
import { Button } from '@/components/ui/button'
import RevisionCard from '@/components/history/RevisionCard'
import ComparisonModal from '@/components/history/ComparisonModal'
import { getHistory, deleteEntry, type HistoryEntry } from '@/services/historyService'

export default function History() {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [compareIdx, setCompareIdx] = useState<number | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    setEntries(getHistory())
  }, [])

  const handleDelete = (id: string) => {
    deleteEntry(id)
    setEntries(getHistory())
  }

  const latest = entries[0] ?? null
  const compareTarget = compareIdx !== null ? entries[compareIdx] : null

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-text-primary">Track Revisions</h1>
            <p className="text-sm text-text-secondary mt-1">Compare your mix versions over time.</p>
          </div>
          <Link to="/app/upload">
            <Button size="md">
              <Plus className="w-4 h-4" />
              Upload New Version
            </Button>
          </Link>
        </div>

        {entries.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-3">
            <p className="text-text-secondary font-body text-sm">No analyses yet.</p>
            <p className="text-text-muted text-xs">Upload and analyze a track to see your history here.</p>
            <Link to="/app/upload">
              <Button size="sm" className="mt-2">
                <Plus className="w-4 h-4" />
                Analyze Your First Track
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, i) => (
              <div key={entry.id} className="relative group">
                <RevisionCard
                  id={entry.id}
                  trackName={entry.trackName}
                  version={entry.version}
                  date={entry.date}
                  genreMode={entry.genreMode}
                  analysisMode={entry.analysisMode}
                  mixdownScore={entry.mixdownScore}
                  clubScore={entry.clubScore}
                  masterScore={entry.masterScore}
                  onCompare={i > 0 && latest ? () => { setCompareIdx(i); setCompareOpen(true) } : undefined}
                />
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/[0.08] text-text-muted hover:text-accent-red"
                  aria-label="Delete entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-start gap-2 mt-8 p-4 glass-card border-border-accent">
          <Info className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary">
            Only your scores and metadata are stored locally — never your audio files.
          </p>
        </div>

        {latest && compareTarget && (
          <ComparisonModal
            open={compareOpen}
            onClose={() => setCompareOpen(false)}
            v1={{
              version: compareTarget.version,
              mixdownScore: compareTarget.mixdownScore,
              clubScore: compareTarget.clubScore,
              masterScore: compareTarget.masterScore,
            }}
            v2={{
              version: latest.version,
              mixdownScore: latest.mixdownScore,
              clubScore: latest.clubScore,
              masterScore: latest.masterScore,
            }}
          />
        )}
      </div>
    </PageTransition>
  )
}
