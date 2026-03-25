import OverallScoreGauge from '../OverallScoreGauge'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import EnergyFlowChart from '@/components/charts/EnergyFlowChart'
import type { ClubReadinessAnalysis } from '@/types/analysis'

interface ClubReadinessTabProps {
  data: ClubReadinessAnalysis
}

export default function ClubReadinessTab({ data }: ClubReadinessTabProps) {
  return (
    <div className="space-y-8">
      {/* Club Score */}
      <div className="flex justify-center">
        <OverallScoreGauge score={data.overallScore} size={180} strokeWidth={12} label="Club Readiness Score" />
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sub-Bass */}
        <Card className="p-5">
          <h4 className="font-display font-semibold text-sm text-accent-pink mb-2">Sub-Bass Sweet Spot (40-60Hz)</h4>
          <p className="text-2xl font-mono font-bold text-text-primary mb-1">{data.subBassLevel.toFixed(1)} dB</p>
          <p className="text-xs text-text-secondary">{data.subBassVerdict}</p>
        </Card>

        {/* Kick Punch */}
        <Card className="p-5">
          <h4 className="font-display font-semibold text-sm text-accent-pink mb-2">Kick Punch & Transient Snap</h4>
          <OverallScoreGauge score={data.kickPunch.score} size={70} strokeWidth={5} />
          <p className="text-xs text-text-secondary mt-2">{data.kickPunch.description}</p>
        </Card>

        {/* Mono Compatibility */}
        <Card className="p-5">
          <h4 className="font-display font-semibold text-sm text-accent-pink mb-2">Mono Compatibility</h4>
          <div className="flex items-center gap-4 mb-2">
            <div className="text-center">
              <p className="text-lg font-mono font-bold text-text-primary">{data.monoCompatibility.stereoLevel.toFixed(1)}</p>
              <p className="text-[10px] text-text-muted">Stereo</p>
            </div>
            <span className="text-text-muted">&rarr;</span>
            <div className="text-center">
              <p className="text-lg font-mono font-bold text-text-primary">{data.monoCompatibility.monoLevel.toFixed(1)}</p>
              <p className="text-[10px] text-text-muted">Mono</p>
            </div>
          </div>
          <Badge variant={data.monoCompatibility.lossPercent > 15 ? 'red' : data.monoCompatibility.lossPercent > 10 ? 'amber' : 'green'}>
            {data.monoCompatibility.lossPercent}% loss
          </Badge>
        </Card>

        {/* High-SPL Simulation */}
        <Card className="p-5">
          <h4 className="font-display font-semibold text-sm text-accent-pink mb-2">High-SPL Simulation (100-110dB)</h4>
          <Badge variant={data.highSplSimulation.warning ? 'amber' : 'green'} className="mb-2">
            {data.highSplSimulation.warning ? 'Warning' : 'Pass'}
          </Badge>
          <p className="text-xs text-text-secondary">{data.highSplSimulation.description}</p>
        </Card>

        {/* DJ Headroom */}
        <Card className="p-5">
          <h4 className="font-display font-semibold text-sm text-accent-pink mb-2">DJ Headroom Check</h4>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg font-mono font-bold text-text-primary">{data.djHeadroom.truePeak.toFixed(1)} dBTP</span>
            <span className="text-xs text-text-muted">vs {data.djHeadroom.target} dBFS target</span>
          </div>
          <Badge variant={data.djHeadroom.pass ? 'green' : 'red'}>
            {data.djHeadroom.pass ? 'Pass' : 'Fail'}
          </Badge>
        </Card>

        {/* BPM & Key */}
        <Card className="p-5">
          <h4 className="font-display font-semibold text-sm text-accent-pink mb-2">BPM & Key Detection</h4>
          <p className="text-3xl font-mono font-bold text-text-primary mb-1">{data.bpmDetection.bpm}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">{data.bpmDetection.key}</span>
            <Badge variant="purple">{data.bpmDetection.camelotPosition}</Badge>
          </div>
        </Card>
      </div>

      {/* Energy Flow */}
      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Arrangement Energy Flow</h3>
        <div className="glass-card p-4">
          <EnergyFlowChart data={data.energyFlow} sections={data.energySections} />
        </div>
      </div>
    </div>
  )
}
