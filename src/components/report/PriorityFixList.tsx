import { AlertTriangle, AlertCircle, Info, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { PriorityIssue } from '@/types/analysis'

interface PriorityFixListProps {
  issues: PriorityIssue[]
  onNavigateTab?: (tab: string) => void
}

const severityConfig = {
  critical: { icon: AlertCircle, variant: 'red' as const, label: 'CRITICAL' },
  warning: { icon: AlertTriangle, variant: 'amber' as const, label: 'WARNING' },
  advisory: { icon: Info, variant: 'cyan' as const, label: 'ADVISORY' },
}

export default function PriorityFixList({ issues, onNavigateTab }: PriorityFixListProps) {
  return (
    <div>
      <h3 className="font-display font-semibold text-lg text-text-primary mb-4">
        Fix These First
      </h3>
      <div className="space-y-3">
        {issues.map((issue, i) => {
          const config = severityConfig[issue.severity]
          const Icon = config.icon
          return (
            <div key={i} className={`glass-card p-4 flex items-start gap-3 overflow-hidden ${
              issue.severity === 'critical' ? 'severity-border-critical' :
              issue.severity === 'warning' ? 'severity-border-warning' : 'severity-border-advisory'
            }`}>
              <div className="flex-shrink-0 mt-0.5">
                <Icon className={`w-4 h-4 ${
                  issue.severity === 'critical' ? 'text-accent-red' :
                  issue.severity === 'warning' ? 'text-accent-amber' : 'text-accent-cyan'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <Badge variant={config.variant} className="text-[10px]">{config.label}</Badge>
                  <span className="font-display font-semibold text-sm text-text-primary break-words">{issue.title}</span>
                </div>
                <p className="text-xs text-text-secondary break-words">{issue.description}</p>
              </div>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab(issue.tab)}
                  className="flex-shrink-0 flex items-center gap-1 text-xs text-accent-cyan hover:underline cursor-pointer"
                  aria-label={`See fix for ${issue.title}`}
                >
                  See Fix <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
