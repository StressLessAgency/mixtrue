import { memo } from 'react'
import { Check, AlertTriangle, X } from 'lucide-react'
import type { PlatformLufs } from '@/types/analysis'

interface LUFSComparisonTableProps {
  data: PlatformLufs[]
  className?: string
}

function StatusIcon({ status }: { status: PlatformLufs['status'] }) {
  switch (status) {
    case 'pass':
      return <Check className="w-4 h-4 text-accent-green" />
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-accent-amber" />
    case 'fail':
      return <X className="w-4 h-4 text-accent-red" />
  }
}

function LUFSComparisonTableInner({ data, className }: LUFSComparisonTableProps) {
  return (
    <div className={`overflow-x-auto ${className ?? ''}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="text-left py-3 px-4 font-display font-semibold text-text-secondary text-xs uppercase tracking-wider">Platform</th>
            <th className="text-left py-3 px-4 font-display font-semibold text-text-secondary text-xs uppercase tracking-wider">Target</th>
            <th className="text-left py-3 px-4 font-display font-semibold text-text-secondary text-xs uppercase tracking-wider">Your Track</th>
            <th className="text-center py-3 px-4 font-display font-semibold text-text-secondary text-xs uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.platform} className="border-b border-border-subtle/50 hover:bg-white/[0.02]">
              <td className="py-3 px-4 font-body text-text-primary">{row.platform}</td>
              <td className="py-3 px-4 font-mono text-text-secondary">{row.target}</td>
              <td className="py-3 px-4 font-mono text-text-primary">{row.userValue.toFixed(1)} LUFS</td>
              <td className="py-3 px-4 text-center">
                <div className="flex justify-center">
                  <StatusIcon status={row.status} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const LUFSComparisonTable = memo(LUFSComparisonTableInner)
export default LUFSComparisonTable
