import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Info, BarChart3 } from 'lucide-react'
import PageTransition from '@/components/layout/PageTransition'
import { Button } from '@/components/ui/button'
import RevisionCard from '@/components/history/RevisionCard'
import ComparisonModal from '@/components/history/ComparisonModal'
import { loadHistory, type HistorySession } from '@/services/historyService'

export default function History() {
  const [sessions, setSessions] = useState<HistorySession[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [compareIdx, setCompareIdx] = useState<number | null>(null)

  // FIX: Load real analysis history from localStorage instead of hardcoded mock data.
  // Sessions are saved by Processing.tsx after every successful Gemini analysis.
  useEffect(() => {
    setSessions(loadHistory())
  }, [])

  const latest = sessions[0]
  const compareTarget = compareIdx !== null ? sessions[compareIdx] : null

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

        {sessions.length === 0 ? (
          // Empty state -- shown before the user has completed any real analysis
          <div className="glass-card p-12 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-accent-cyan/10 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-accent-cyan/50" />
            </div>
            <div>
              <p className="font-display font-semibold text-text-primary mb-1">No analyses yet</p>
              <p className="text-sm text-text-secondary max-w-sm">
                Complete your first analysis and it will appear here. Every version is tracked so
                you can measure your progress over time.
              </p>
            </div>
            <Link to="/app/upload">
              <Button size="md" variant="ghost">
                Analyze Your First Track
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, i) => (
              <RevisionCard
                key={session.id}
                {...session}
                onCompare={
                  i > 0
                    ? () => {
                        setCompareIdx(i)
                        setCompareOpen(true)
                      }
                    : undefined
                }
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
