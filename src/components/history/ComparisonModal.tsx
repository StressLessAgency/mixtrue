import { Dialog } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface VersionData {
  version: string
  mixdownScore: number
  clubScore: number
  masterScore: number
}

interface ComparisonModalProps {
  open: boolean
  onClose: () => void
  v1: VersionData | null
  v2: VersionData | null
}

function ScoreDiff({ label, v1, v2 }: { label: string; v1: number; v2: number }) {
  const diff = v2 - v1
  const color = diff > 0 ? 'text-accent-green' : diff < 0 ? 'text-accent-red' : 'text-text-muted'

  return (
    <tr className="border-b border-border-subtle/50">
      <td className="py-3 px-4 text-sm text-text-primary font-body">{label}</td>
      <td className="py-3 px-4 text-sm font-mono text-text-secondary text-center">{v1}</td>
      <td className="py-3 px-4 text-sm font-mono text-text-secondary text-center">{v2}</td>
      <td className={`py-3 px-4 text-sm font-mono text-center ${color}`}>
        {diff > 0 ? '+' : ''}{diff}
      </td>
    </tr>
  )
}

export default function ComparisonModal({ open, onClose, v1, v2 }: ComparisonModalProps) {
  if (!v1 || !v2) return null

  return (
    <Dialog open={open} onClose={onClose} title="Version Comparison">
      <div className="flex items-center gap-3 mb-4">
        <Badge variant="default">{v1.version}</Badge>
        <span className="text-text-muted">vs</span>
        <Badge variant="cyan">{v2.version}</Badge>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="text-left py-2 px-4 text-xs uppercase text-text-secondary">Category</th>
            <th className="text-center py-2 px-4 text-xs uppercase text-text-secondary">{v1.version}</th>
            <th className="text-center py-2 px-4 text-xs uppercase text-text-secondary">{v2.version}</th>
            <th className="text-center py-2 px-4 text-xs uppercase text-text-secondary">Change</th>
          </tr>
        </thead>
        <tbody>
          <ScoreDiff label="Mixdown Score" v1={v1.mixdownScore} v2={v2.mixdownScore} />
          <ScoreDiff label="Club Score" v1={v1.clubScore} v2={v2.clubScore} />
          <ScoreDiff label="Master Score" v1={v1.masterScore} v2={v2.masterScore} />
        </tbody>
      </table>

      <p className="text-xs text-text-muted mt-4">
        Only your scores and metadata are stored — never your audio files.
      </p>
    </Dialog>
  )
}
