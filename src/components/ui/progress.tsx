import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  showLabel?: boolean
}

export function Progress({ value, max = 100, className, barClassName, showLabel }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('relative', className)}>
      <div className="w-full h-2 rounded-full bg-bg-tertiary overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            'bg-gradient-to-r from-accent-cyan to-accent-cyan/80',
            barClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="absolute right-0 -top-5 text-xs font-mono text-accent-cyan">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}
