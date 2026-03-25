import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Info } from 'lucide-react'
import PageTransition from '@/components/layout/PageTransition'
import { Button } from '@/components/ui/button'
import RevisionCard from '@/components/history/RevisionCard'
import ComparisonModal from '@/components/history/ComparisonModal'
import { mockHistorySessions } from '@/services/mockData'

export default function History() {
  const [compareOpen, setCompareOpen] = useState(false)
  const [compareIdx, setCompareIdx] = useState<number | null>(null)

  const latest = mockHistorySessions[0]
  const compareTarget = compareIdx !== null ? mockHistorySessions[compareIdx] : null

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

        <div className="space-y-4">
          {mockHistorySessions.map((session, i) => (
            <RevisionCard
              key={session.id}
              {...session}
              onCompare={i > 0 ? () => { setCompareIdx(i); setCompareOpen(true) } : undefined}
            />
          ))}
        </div>

        <div className="flex items-start gap-2 mt-8 p-4 glass-card border-border-accent">
          <Info className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary">
            Only your scores and metadata are stored — never your audio files.
          </p>
        </div>

        <ComparisonModal
          open={compareOpen}
          onClose={() => setCompareOpen(false)}
          v1={compareTarget ? { version: compareTarget.version, mixdownScore: compareTarget.mixdownScore, clubScore: compareTarget.clubScore, masterScore: compareTarget.masterScore } : null}
          v2={{ version: latest.version, mixdownScore: latest.mixdownScore, clubScore: latest.clubScore, masterScore: latest.masterScore }}
        />
      </div>
    </PageTransition>
  )
}
