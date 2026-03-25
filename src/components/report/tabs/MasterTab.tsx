import { memo } from 'react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar } from 'recharts'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import LUFSComparisonTable from '@/components/charts/LUFSComparisonTable'
import type { MasterAnalysis } from '@/types/analysis'
import { formatFrequency } from '@/lib/utils'

interface MasterTabProps {
  data: MasterAnalysis
}

function MasterTabInner({ data }: MasterTabProps) {
  return (
    <div className="space-y-8">
      {/* LUFS Targets */}
      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Platform LUFS Targets</h3>
        <div className="glass-card">
          <LUFSComparisonTable data={data.platformTargets} />
        </div>
      </div>

      {/* Master Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Integrated LUFS', value: `${data.integratedLufs.toFixed(1)}`, unit: 'LUFS' },
          { label: 'Short-Term LUFS', value: `${data.shortTermLufs.toFixed(1)}`, unit: 'LUFS' },
          { label: 'True Peak', value: `${data.truePeak.toFixed(1)}`, unit: 'dBTP' },
          { label: 'Loudness Range', value: `${data.loudnessRange.toFixed(1)}`, unit: 'LU' },
        ].map((m) => (
          <Card key={m.label} className="p-4 text-center">
            <p className="text-xs text-text-secondary font-body mb-1">{m.label}</p>
            <p className="text-2xl font-mono font-bold text-text-primary">
              {m.value}<span className="text-xs text-text-muted ml-1">{m.unit}</span>
            </p>
          </Card>
        ))}
      </div>

      {/* Inter-Sample Distortion */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-display font-semibold text-sm text-text-primary">Inter-Sample Distortion</h4>
            <p className="text-xs text-text-secondary mt-1">
              {data.interSampleDistortionCount} violation{data.interSampleDistortionCount !== 1 ? 's' : ''} detected
            </p>
          </div>
          <Badge variant={data.interSampleDistortionCount > 5 ? 'red' : data.interSampleDistortionCount > 0 ? 'amber' : 'green'}>
            {data.interSampleDistortionCount} events
          </Badge>
        </div>
      </Card>

      {/* Limiter Artifacts */}
      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Limiter Artifact Detection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.limiterArtifacts.map((artifact) => (
            <Card
              key={artifact.type}
              className={`p-4 ${artifact.detected ? 'border-accent-red/20' : 'border-accent-green/20'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-semibold text-sm text-text-primary">{artifact.type}</span>
                <Badge variant={artifact.detected ? 'red' : 'green'} className="text-[10px]">
                  {artifact.detected ? 'Detected' : 'Clean'}
                </Badge>
              </div>
              <p className="text-xs text-text-secondary">{artifact.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Codec Simulation */}
      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Codec Simulation</h3>
        <div className="glass-card p-4">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.codecSimulation}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="frequency" tickFormatter={(v: number) => formatFrequency(v)} tick={{ fill: '#8896A8', fontSize: 10 }} stroke="rgba(255,255,255,0.06)" />
              <YAxis tick={{ fill: '#8896A8', fontSize: 10 }} stroke="rgba(255,255,255,0.06)" />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'DM Sans' }} />
              <Area type="monotone" dataKey="lossless" name="Lossless" stroke="#00E5FF" fill="transparent" strokeWidth={2} />
              <Area type="monotone" dataKey="mp3_320" name="MP3 320" stroke="#FFB800" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
              <Area type="monotone" dataKey="aac_256" name="AAC 256" stroke="#FF2D78" fill="transparent" strokeWidth={1.5} strokeDasharray="6 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Harmonic Distortion */}
      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Harmonic Distortion (THD)</h3>
        <div className="glass-card p-4">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.harmonicDistortion}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="order" tick={{ fill: '#8896A8', fontSize: 10 }} stroke="rgba(255,255,255,0.06)" />
              <YAxis tickFormatter={(v: number) => `${v}%`} tick={{ fill: '#8896A8', fontSize: 10 }} stroke="rgba(255,255,255,0.06)" />
              <Bar dataKey="percentage" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Noise Floor */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-text-secondary">Noise Floor</p>
            <p className="text-xl font-mono font-bold text-text-primary">{data.noiseFloor.toFixed(1)} dBFS</p>
          </div>
          <Badge variant={data.noiseFloor < -60 ? 'green' : 'amber'}>
            {data.noiseFloor < -60 ? 'Low' : 'Moderate'}
          </Badge>
        </div>
      </Card>
    </div>
  )
}

const MasterTab = memo(MasterTabInner)
export default MasterTab
