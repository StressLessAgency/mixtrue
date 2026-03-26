import PriorityFixList from '../PriorityFixList'
import CategoryScoreCard from '../CategoryScoreCard'
import ReferenceTrackList from '../ReferenceTrackList'
import type { ReportData } from '@/types/analysis'

interface OverviewTabProps {
  report: ReportData
  onNavigateTab?: (tab: string) => void
}

export default function OverviewTab({ report, onNavigateTab }: OverviewTabProps) {
  return (
    <div className="space-y-10">
      <PriorityFixList issues={report.priorityIssues} onNavigateTab={onNavigateTab} />

      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Score Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {report.categoryScores.map((cat) => (
            <CategoryScoreCard
              key={cat.category}
              category={cat.category}
              score={cat.score}
              verdict={cat.verdict}
            />
          ))}
        </div>
      </div>

      {report.referenceTrackSuggestions && report.referenceTrackSuggestions.length > 0 && (
        <ReferenceTrackList tracks={report.referenceTrackSuggestions} />
      )}
    </div>
  )
}
