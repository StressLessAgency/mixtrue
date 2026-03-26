import { Disc3 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ReferenceTrackSuggestion } from '@/types/analysis'

interface ReferenceTrackListProps {
  tracks: ReferenceTrackSuggestion[]
}

export default function ReferenceTrackList({ tracks }: ReferenceTrackListProps) {
  if (!tracks.length) return null

  return (
    <div>
      <h3 className="font-display font-semibold text-lg text-text-primary mb-4">
        Reference Tracks
      </h3>
      <p className="text-xs text-text-secondary mb-4">
        These tracks exemplify qualities your mix could benefit from. Use them as reference during mixing and mastering.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tracks.map((track, i) => (
          <div key={i} className="glass-card gradient-border p-4 space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center flex-shrink-0">
                <Disc3 className="w-4 h-4 text-accent-purple" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-display font-semibold text-text-primary truncate">{track.track}</p>
                <p className="text-xs text-text-secondary">{track.artist}</p>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{track.reason}</p>
            <Badge variant="purple" className="text-[10px]">{track.relevantMetric}</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
