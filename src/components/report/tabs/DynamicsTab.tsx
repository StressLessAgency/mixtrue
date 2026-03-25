import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import WaveformDisplay from '@/components/charts/WaveformDisplay'
import type { DynamicsAnalysis } from '@/types/analysis'

interface DynamicsTabProps {
  data: DynamicsAnalysis
}

export default function DynamicsTab({ data }: DynamicsTabProps) {
  const { metrics } = data

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'DR Score', value: metrics.drScore.toFixed(1), unit: '', rating: metrics.drRating },
          { label: 'Integrated LUFS', value: metrics.integratedLufs.toFixed(1), unit: ' LUFS', rating: null },
          { label: 'RMS Level', value: metrics.rmsLevel.toFixed(1), unit: ' dBFS', rating: null },
          { label: 'Crest Factor', value: metrics.crestFactor.toFixed(1), unit: ' dB', rating: null },
        ].map((metric) => (
          <Card key={metric.label} className="p-4 text-center">
            <p className="text-xs text-text-secondary font-body mb-1">{metric.label}</p>
            <p className="text-2xl font-mono font-bold text-text-primary">
              {metric.value}<span className="text-sm text-text-muted">{metric.unit}</span>
            </p>
            {metric.rating && (
              <Badge
                variant={metric.rating === 'Good' ? 'green' : metric.rating === 'Fair' ? 'amber' : 'red'}
                className="mt-2 text-[10px]"
              >
                {metric.rating}
              </Badge>
            )}
          </Card>
        ))}
      </div>

      {/* Waveform */}
      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Dynamic Range Waveform</h3>
        <div className="glass-card p-4">
          <WaveformDisplay data={data.waveformData} height={140} />
          <div className="flex gap-4 mt-3 text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-full bg-accent-cyan" />
              Normal
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-full bg-accent-amber" />
              Over-compressed
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-full bg-accent-red" />
              Clipping
            </div>
          </div>
        </div>
      </div>

      {/* Transient Analysis */}
      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Transient Snap by Band</h3>
        <div className="glass-card p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.transientBands}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="band" tick={{ fill: '#8896A8', fontSize: 10 }} stroke="rgba(255,255,255,0.06)" />
              <YAxis tick={{ fill: '#8896A8', fontSize: 10 }} stroke="rgba(255,255,255,0.06)" />
              <Bar dataKey="snap" fill="#00E5FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="rgba(255,184,0,0.3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Over-Compression Detection */}
      {data.overCompressionDetected && (
        <div className="glass-card p-5 border-accent-amber/20">
          <h3 className="font-display font-semibold text-sm text-accent-amber mb-2">Over-Compression Detected</h3>
          <p className="text-sm text-text-secondary mb-3">
            Estimated compression ratio: <span className="font-mono text-text-primary">{data.compressionRatioEstimate}:1</span>.
            The master bus limiter is clamping too aggressively, reducing transient punch and dynamic energy.
          </p>
          <p className="text-xs text-text-muted">
            Recommendation: Reduce limiter input gain by 2-3dB and increase release time.
          </p>
        </div>
      )}
    </div>
  )
}
