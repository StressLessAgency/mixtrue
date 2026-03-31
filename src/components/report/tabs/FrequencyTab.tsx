import SpectrumChart from '@/components/charts/SpectrumChart'
import { Badge } from '@/components/ui/badge'
import type { FrequencyAnalysis } from '@/types/analysis'

interface FrequencyTabProps {
  data: FrequencyAnalysis
}

const statusVariant = {
  ok: 'green' as const,
  boost: 'amber' as const,
  cut: 'amber' as const,
  critical: 'red' as const,
}

export default function FrequencyTab({ data }: FrequencyTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Full Spectrum Analysis</h3>
        <div className="glass-card p-4">
          <SpectrumChart data={data.spectrumData} />
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Band Breakdown</h3>
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-display font-semibold text-text-secondary text-xs uppercase">Band</th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-display font-semibold text-text-secondary text-xs uppercase">Range</th>
                <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-display font-semibold text-text-secondary text-xs uppercase">Level</th>
                <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-display font-semibold text-text-secondary text-xs uppercase">Target</th>
                <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-display font-semibold text-text-secondary text-xs uppercase">Dev</th>
                <th className="text-center py-2 px-2 sm:py-3 sm:px-4 font-display font-semibold text-text-secondary text-xs uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.bands.map((band) => (
                <tr key={band.name} className="border-b border-border-subtle/50 hover:bg-white/[0.02]">
                  <td className="py-2 px-2 sm:py-3 sm:px-4 font-body text-text-primary text-xs sm:text-sm">{band.name}</td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 font-mono text-text-secondary text-xs">{band.range}</td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 font-mono text-text-primary text-right text-xs">{band.userLevel.toFixed(1)}</td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 font-mono text-text-secondary text-right text-xs">{band.genreTarget.toFixed(1)}</td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 font-mono text-right text-xs" style={{
                    color: Math.abs(band.deviation) > 2 ? '#FF3B5C' : Math.abs(band.deviation) > 1 ? '#FFB800' : '#00FF9D',
                  }}>
                    {band.deviation > 0 ? '+' : ''}{band.deviation.toFixed(1)}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-center">
                    <Badge variant={statusVariant[band.status]} className="text-[10px] uppercase">
                      {band.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Detected Issues</h3>
        <div className="space-y-4">
          {data.issues.map((issue, i) => (
            <div key={i} className="glass-card p-5">
              <h4 className="font-display font-semibold text-sm text-accent-amber mb-2">{issue.type}</h4>
              <p className="text-sm text-text-secondary mb-3">{issue.description}</p>
              <div className="bg-bg-primary rounded-lg p-3 font-mono text-xs text-accent-cyan border border-border-subtle">
                {issue.eqFix}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
