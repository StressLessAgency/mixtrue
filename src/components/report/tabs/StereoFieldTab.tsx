import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import GoniometerDisplay from '@/components/charts/GoniometerDisplay'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { StereoFieldAnalysis } from '@/types/analysis'

interface StereoFieldTabProps {
  data: StereoFieldAnalysis
}

export default function StereoFieldTab({ data }: StereoFieldTabProps) {
  const phaseColor = data.phaseCorrelation > 0.5 ? '#00FF9D' : data.phaseCorrelation > 0 ? '#FFB800' : '#FF3B5C'

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goniometer */}
        <div>
          <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Stereo Phase Display</h3>
          <div className="glass-card p-4 flex justify-center">
            <GoniometerDisplay data={data.goniometerData} size={260} />
          </div>
        </div>

        {/* M/S Balance + Phase */}
        <div className="space-y-6">
          <div>
            <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Mid/Side Balance</h3>
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono text-text-secondary w-8">Mid</span>
                <div className="flex-1 h-4 rounded-full bg-bg-tertiary overflow-hidden">
                  <div className="h-full rounded-full bg-accent-cyan" style={{ width: `${data.midSideBalance.mid}%` }} />
                </div>
                <span className="text-xs font-mono text-accent-cyan w-10 text-right">{data.midSideBalance.mid}%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-text-secondary w-8">Side</span>
                <div className="flex-1 h-4 rounded-full bg-bg-tertiary overflow-hidden">
                  <div className="h-full rounded-full bg-accent-purple" style={{ width: `${data.midSideBalance.side}%` }} />
                </div>
                <span className="text-xs font-mono text-accent-purple w-10 text-right">{data.midSideBalance.side}%</span>
              </div>
            </Card>
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Phase Correlation</h3>
            <Card className="p-4 text-center">
              <div className="relative h-6 rounded-full bg-bg-tertiary overflow-hidden mb-2">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 bg-gradient-to-r from-accent-red/20 to-transparent" />
                  <div className="w-1/2 bg-gradient-to-l from-accent-green/20 to-transparent" />
                </div>
                <div
                  className="absolute top-0 h-full w-1 rounded-full"
                  style={{
                    left: `${((data.phaseCorrelation + 1) / 2) * 100}%`,
                    backgroundColor: phaseColor,
                    boxShadow: `0 0 8px ${phaseColor}`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-text-muted">
                <span>-1</span>
                <span>0</span>
                <span>+1</span>
              </div>
              <p className="mt-2 text-lg font-mono font-bold" style={{ color: phaseColor }}>
                {data.phaseCorrelation.toFixed(2)}
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Per-Band Stereo Width */}
      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Stereo Width by Band</h3>
        <div className="glass-card p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.stereoWidthBands} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#8896A8', fontSize: 10 }} stroke="rgba(255,255,255,0.06)" />
              <YAxis type="category" dataKey="band" tick={{ fill: '#8896A8', fontSize: 10 }} stroke="rgba(255,255,255,0.06)" width={70} />
              <ReferenceLine x={50} stroke="rgba(255,255,255,0.1)" />
              <Bar dataKey="width" fill="#00E5FF" radius={[0, 4, 4, 0]} barSize={12} />
              <Bar dataKey="ideal" fill="rgba(255,184,0,0.25)" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Issues Timeline */}
      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Stereo Issues</h3>
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-3 px-4 text-xs uppercase text-text-secondary font-display">Timestamp</th>
                <th className="text-left py-3 px-4 text-xs uppercase text-text-secondary font-display">Issue</th>
                <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display">Severity</th>
              </tr>
            </thead>
            <tbody>
              {data.issues.map((issue, i) => (
                <tr key={i} className="border-b border-border-subtle/50">
                  <td className="py-3 px-4 font-mono text-accent-cyan text-xs">{issue.timestamp}</td>
                  <td className="py-3 px-4 text-text-primary text-xs">{issue.issue}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={issue.severity === 'warning' ? 'amber' : 'cyan'} className="text-[10px]">
                      {issue.severity.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Haas / Comb */}
      <div className="grid grid-cols-2 gap-4">
        <Card className={cn('p-4', data.haasEffectDetected ? 'border-accent-amber/20' : 'border-accent-green/20')}>
          <p className="text-xs text-text-secondary mb-1">Haas Effect</p>
          <Badge variant={data.haasEffectDetected ? 'amber' : 'green'}>
            {data.haasEffectDetected ? 'Detected' : 'Not Detected'}
          </Badge>
        </Card>
        <Card className={cn('p-4', data.combFilteringDetected ? 'border-accent-amber/20' : 'border-accent-green/20')}>
          <p className="text-xs text-text-secondary mb-1">Comb Filtering</p>
          <Badge variant={data.combFilteringDetected ? 'amber' : 'green'}>
            {data.combFilteringDetected ? 'Detected' : 'Not Detected'}
          </Badge>
        </Card>
      </div>
    </div>
  )
}
