import { memo } from 'react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import type { AIFixesAnalysis, SeverityLevel } from '@/types/analysis'
import { formatFrequency } from '@/lib/utils'

interface AIFixesTabProps {
  data: AIFixesAnalysis
  onExportPdf?: () => void
}

const priorityVariant: Record<SeverityLevel, 'red' | 'amber' | 'cyan'> = {
  critical: 'red',
  warning: 'amber',
  advisory: 'cyan',
}

function AIFixesTabInner({ data, onExportPdf }: AIFixesTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display font-bold text-xl text-text-primary mb-2">Your Personalized Fix Plan</h3>
        <p className="text-sm text-text-secondary mb-6">
          Action plan based on your analysis results. Follow these fixes in priority order.
        </p>
      </div>

      {/* Fix Cards */}
      <div className="space-y-6">
        {data.fixes.map((fix, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={priorityVariant[fix.priority]} className="text-[10px] uppercase">
                {fix.priority}
              </Badge>
              <Badge variant="default" className="text-[10px]">{fix.category}</Badge>
            </div>

            <h4 className="font-display font-semibold text-lg text-text-primary mb-2">{fix.title}</h4>
            <p className="text-sm text-text-secondary mb-4">{fix.problem}</p>

            <div className="mb-4">
              <p className="text-xs font-display font-semibold text-text-primary mb-2 uppercase tracking-wider">Fix Steps:</p>
              <ol className="space-y-1.5">
                {fix.fix.map((step, j) => (
                  <li key={j} className="flex gap-2 text-sm text-text-secondary">
                    <span className="text-accent-cyan font-mono text-xs mt-0.5">{j + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {fix.pluginSuggestions.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-text-muted mb-1.5">Plugin Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {fix.pluginSuggestions.map((plugin) => (
                    <Badge key={plugin} variant="purple" className="text-[10px]">{plugin}</Badge>
                  ))}
                </div>
              </div>
            )}

            {fix.settings.length > 0 && (
              <div className="bg-bg-primary rounded-lg p-3 font-mono text-xs text-accent-cyan border border-border-subtle mb-4">
                {fix.settings.map((s, j) => (
                  <div key={j}>
                    {s.frequency && `Freq: ${formatFrequency(s.frequency)} | Gain: ${s.gain}dB | Q: ${s.q}`}
                    {s.param && `${s.param}: ${s.value}`}
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-accent-green">
              {fix.estimatedImprovement}
            </p>
          </div>
        ))}
      </div>

      {/* Before/After Spectrum */}
      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-2">Before/After Simulation</h3>
        <p className="text-xs text-text-muted mb-4">
          Estimated spectrum after applying all recommended fixes. This is a simulation estimate, not a guarantee.
        </p>
        <div className="glass-card p-4">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.beforeAfterSpectrum}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="frequency" tickFormatter={(v: number) => formatFrequency(v)} tick={{ fill: '#8896A8', fontSize: 10 }} stroke="rgba(255,255,255,0.06)" />
              <YAxis tick={{ fill: '#8896A8', fontSize: 10 }} stroke="rgba(255,255,255,0.06)" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="before" name="Before" stroke="#FF3B5C" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
              <Area type="monotone" dataKey="after" name="After (Projected)" stroke="#00FF9D" fill="rgba(0,255,157,0.05)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export */}
      <Button size="xl" className="w-full" onClick={onExportPdf}>
        <Download className="w-5 h-5" />
        Download Full PDF Report
      </Button>
    </div>
  )
}

const AIFixesTab = memo(AIFixesTabInner)
export default AIFixesTab
