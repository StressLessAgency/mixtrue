import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, GitCompare } from 'lucide-react'
import OverallScoreGauge from '@/components/report/OverallScoreGauge'

interface RevisionCardProps {
  id: string
  trackName: string
  version?: string
  date: string
  genreMode: string
  analysisMode: string
  mixdownScore: number
  clubScore: number
  masterScore: number
  onCompare?: () => void
}

export default function RevisionCard({
  id,
  trackName,
  version,
  date,
  genreMode,
  analysisMode,
  mixdownScore,
  clubScore,
  masterScore,
  onCompare,
}: RevisionCardProps) {
  return (
    <div className="glass-card glass-card-hover p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {version && <Badge variant="cyan" className="text-[10px]">{version}</Badge>}
            <h3 className="font-display font-semibold text-sm text-text-primary truncate">{trackName}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs text-text-muted font-mono">{date}</span>
            <Badge variant="purple" className="text-[10px] capitalize">{genreMode}</Badge>
            <Badge variant="default" className="text-[10px] capitalize">{analysisMode}</Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 mb-4">
        <div className="text-center">
          <OverallScoreGauge score={mixdownScore} size={56} strokeWidth={4} />
          <p className="text-[10px] text-text-muted mt-1">Mixdown</p>
        </div>
        <div className="text-center">
          <OverallScoreGauge score={clubScore} size={56} strokeWidth={4} />
          <p className="text-[10px] text-text-muted mt-1">Club</p>
        </div>
        <div className="text-center">
          <OverallScoreGauge score={masterScore} size={56} strokeWidth={4} />
          <p className="text-[10px] text-text-muted mt-1">Master</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Link to={`/app/report/${id}`}>
          <Button variant="outline" size="sm">
            <Eye className="w-3 h-3" />
            View Report
          </Button>
        </Link>
        {onCompare && (
          <Button variant="muted" size="sm" onClick={onCompare}>
            <GitCompare className="w-3 h-3" />
            Compare with Latest
          </Button>
        )}
      </div>
    </div>
  )
}
