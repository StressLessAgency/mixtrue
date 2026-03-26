import OverallScoreGauge from './OverallScoreGauge'

interface CategoryScoreCardProps {
  category: string
  score: number
  verdict: string
}

export default function CategoryScoreCard({ category, score, verdict }: CategoryScoreCardProps) {
  return (
    <div className="glass-card gradient-border hover-reveal p-4 flex flex-col items-center text-center gap-3 cursor-default">
      <OverallScoreGauge score={score} size={90} strokeWidth={6} />
      <div>
        <h4 className="font-display font-semibold text-sm text-text-primary">{category}</h4>
        <p className="text-xs text-text-secondary mt-1 line-clamp-2">{verdict}</p>
      </div>
    </div>
  )
}
