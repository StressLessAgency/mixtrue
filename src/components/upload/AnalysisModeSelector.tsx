import { motion } from 'framer-motion'
import { Layers, Disc, Zap } from 'lucide-react'
import type { AnalysisMode } from '@/types/analysis'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const modes: { id: AnalysisMode; label: string; icon: typeof Layers; description: string; recommended?: boolean }[] = [
  { id: 'mixdown', label: 'Mixdown Only', icon: Layers, description: 'Analyze your mixdown — frequency, dynamics, stereo field, and clarity.' },
  { id: 'master', label: 'Master Only', icon: Disc, description: 'Analyze your master — loudness, true peak, codec resilience, and platform targets.' },
  { id: 'both', label: 'Both (Full Analysis)', icon: Zap, description: 'Complete analysis of mixdown and master — all categories, maximum insight.', recommended: true },
]

interface AnalysisModeSelectorProps {
  selected: AnalysisMode | null
  onSelect: (mode: AnalysisMode) => void
}

export default function AnalysisModeSelector({ selected, onSelect }: AnalysisModeSelectorProps) {
  return (
    <div>
      <h3 className="font-display font-semibold text-lg text-text-primary mb-2">Analysis Mode</h3>
      <p className="text-sm text-text-secondary mb-6">Choose what to analyze.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode) => {
          const isSelected = selected === mode.id
          const Icon = mode.icon
          return (
            <motion.button
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'glass-card p-5 text-left cursor-pointer relative transition-all',
                isSelected
                  ? 'border-accent-cyan/40 glow-cyan'
                  : 'hover:border-border-accent'
              )}
              aria-label={`Select ${mode.label} mode`}
            >
              {mode.recommended && (
                <Badge variant="cyan" className="absolute -top-2.5 right-3 text-[10px]">
                  Recommended
                </Badge>
              )}
              <Icon className={cn('w-6 h-6 mb-3', isSelected ? 'text-accent-cyan' : 'text-text-muted')} />
              <h4 className={cn('font-display font-semibold text-sm mb-1', isSelected ? 'text-accent-cyan' : 'text-text-primary')}>
                {mode.label}
              </h4>
              <p className="text-xs text-text-secondary">{mode.description}</p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
