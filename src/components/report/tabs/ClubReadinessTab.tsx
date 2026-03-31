import OverallScoreGauge from '../OverallScoreGauge'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import EnergyFlowChart from '@/components/charts/EnergyFlowChart'
import type { ClubReadinessAnalysis, ArrangementSection } from '@/types/analysis'

interface ClubReadinessTabProps {
  data: ClubReadinessAnalysis
}

function sectionColor(verdict: ArrangementSection['verdict']): string {
  if (verdict === 'strong') return 'text-accent-green'
  if (verdict === 'needs-work') return 'text-accent-amber'
  return 'text-accent-red'
}

function sectionBg(verdict: ArrangementSection['verdict']): string {
  if (verdict === 'strong') return 'border-l-2 border-accent-green'
  if (verdict === 'needs-work') return 'border-l-2 border-accent-amber'
  return 'border-l-2 border-accent-red'
}

function fmtTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
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

      {/* Song Structure / Arrangement */}
      {data.arrangement && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-text-primary">Song Structure</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted font-mono">STRUCTURE SCORE</span>
              <span className={`text-sm font-mono font-bold ${data.arrangement.overallStructureScore >= 80 ? 'text-accent-green' : data.arrangement.overallStructureScore >= 60 ? 'text-accent-cyan' : 'text-accent-amber'}`}>
                {data.arrangement.overallStructureScore}/100
              </span>
            </div>
          </div>

          {/* Structure verdict */}
          <div className="glass-card p-4 mb-4">
            <p className="text-sm text-text-secondary mb-1">{data.arrangement.structureVerdict}</p>
            <p className="text-xs text-text-muted">{data.arrangement.genreStructureComparison}</p>
          </div>

          {/* Timeline */}
          {data.arrangement.sections.length > 0 && (
            <div className="glass-card p-4 mb-4">
              {/* Visual timeline bar */}
              <div className="flex rounded-lg overflow-hidden h-6 mb-3">
                {(() => {
                  const totalDur = data.arrangement.sections[data.arrangement.sections.length - 1]?.endTime || 1
                  return data.arrangement.sections.map((sec, i) => {
                    const width = ((sec.endTime - sec.startTime) / totalDur) * 100
                    const colors = ['#00E5FF', '#7C3AED', '#00FF9D', '#FFB800', '#FF3B5C', '#FF6B35', '#A855F7', '#06B6D4']
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-center text-[9px] font-mono font-bold text-bg-primary truncate px-1"
                        style={{ width: `${width}%`, backgroundColor: colors[i % colors.length], minWidth: '20px' }}
                        title={`${sec.label}: ${fmtTime(sec.startTime)} - ${fmtTime(sec.endTime)}`}
                      >
                        {width > 6 ? sec.label.split(' ')[0] : ''}
                      </div>
                    )
                  })
                })()}
              </div>
              <div className="space-y-2">
                {data.arrangement.sections.map((sec, i) => (
                  <div key={i} className={`p-3 rounded-lg bg-white/[0.02] ${sectionBg(sec.verdict)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-text-muted">{fmtTime(sec.startTime)} – {fmtTime(sec.endTime)}</span>
                        <span className={`text-sm font-display font-semibold ${sectionColor(sec.verdict)}`}>{sec.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-text-muted font-mono">TRANSITION</span>
                        <span className={`text-xs font-mono ${sec.transitionQuality >= 75 ? 'text-accent-green' : sec.transitionQuality >= 50 ? 'text-accent-amber' : 'text-accent-red'}`}>
                          {sec.transitionQuality}/100
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary">{sec.feedback}</p>
                    {sec.transitionFeedback && (
                      <p className="text-[11px] text-text-muted mt-1 italic">{sec.transitionFeedback}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section length analysis */}
          {data.arrangement.sectionLengthAnalysis?.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {data.arrangement.sectionLengthAnalysis.map((sl, i) => (
                <div key={i} className="glass-card p-3 text-center">
                  <p className="text-[10px] text-text-muted font-mono mb-1">{sl.section.toUpperCase()}</p>
                  <p className="text-lg font-mono font-bold text-text-primary">{sl.bars}</p>
                  <p className="text-[10px] text-text-muted">bars</p>
                  <Badge
                    variant={sl.verdict === 'ok' ? 'green' : sl.verdict === 'too-short' ? 'amber' : 'red'}
                    className="mt-1 text-[9px]"
                  >
                    {sl.verdict === 'ok' ? 'Ideal' : sl.verdict === 'too-short' ? 'Too Short' : 'Too Long'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DJ Playability */}
      {data.djPlayability && (
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-display font-semibold text-lg text-text-primary">DJ Playability</h3>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-center">
                <p className="text-[10px] text-text-muted font-mono">MIX IN</p>
                <p className={`text-sm font-mono font-bold ${data.djPlayability.mixInScore >= 75 ? 'text-accent-green' : data.djPlayability.mixInScore >= 50 ? 'text-accent-amber' : 'text-accent-red'}`}>
                  {data.djPlayability.mixInScore}/100
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-text-muted font-mono">MIX OUT</p>
                <p className={`text-sm font-mono font-bold ${data.djPlayability.mixOutScore >= 75 ? 'text-accent-green' : data.djPlayability.mixOutScore >= 50 ? 'text-accent-amber' : 'text-accent-red'}`}>
                  {data.djPlayability.mixOutScore}/100
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-text-muted font-mono">OVERALL</p>
                <p className={`text-sm font-mono font-bold ${data.djPlayability.overallScore >= 75 ? 'text-accent-green' : data.djPlayability.overallScore >= 50 ? 'text-accent-amber' : 'text-accent-red'}`}>
                  {data.djPlayability.overallScore}/100
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Intro / Outro */}
            <Card className="p-5">
              <h4 className="font-display font-semibold text-sm text-text-primary mb-3">Intro / Outro Length</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-muted font-mono">INTRO</span>
                    <Badge variant={data.djPlayability.introLength.verdict === 'ideal' ? 'green' : 'amber'}>
                      {data.djPlayability.introLength.verdict}
                    </Badge>
                  </div>
                  <p className="text-sm font-mono text-text-primary">
                    {data.djPlayability.introLength.bars} bars ({fmtTime(data.djPlayability.introLength.seconds)})
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">{data.djPlayability.introLength.recommendation}</p>
                </div>
                <div className="border-t border-border-subtle pt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-muted font-mono">OUTRO</span>
                    <Badge variant={data.djPlayability.outroLength.verdict === 'ideal' ? 'green' : 'amber'}>
                      {data.djPlayability.outroLength.verdict}
                    </Badge>
                  </div>
                  <p className="text-sm font-mono text-text-primary">
                    {data.djPlayability.outroLength.bars} bars ({fmtTime(data.djPlayability.outroLength.seconds)})
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">{data.djPlayability.outroLength.recommendation}</p>
                </div>
              </div>
            </Card>

            {/* Key Compatibility */}
            <Card className="p-5">
              <h4 className="font-display font-semibold text-sm text-text-primary mb-3">Key Compatibility</h4>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-mono font-bold text-text-primary">{data.djPlayability.keyCompatibility.key}</span>
                <Badge variant="purple">{data.djPlayability.keyCompatibility.camelot}</Badge>
              </div>
              {data.djPlayability.keyCompatibility.compatibleKeys?.length > 0 && (
                <div className="mb-2">
                  <p className="text-[10px] text-text-muted font-mono mb-1">COMPATIBLE KEYS</p>
                  <div className="flex flex-wrap gap-1">
                    {data.djPlayability.keyCompatibility.compatibleKeys.map((k, i) => (
                      <Badge key={i} variant="default" className="text-[10px]">{k}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {data.djPlayability.keyCompatibility.energyBoostKeys?.length > 0 && (
                <div>
                  <p className="text-[10px] text-text-muted font-mono mb-1">ENERGY BOOST KEYS</p>
                  <div className="flex flex-wrap gap-1">
                    {data.djPlayability.keyCompatibility.energyBoostKeys.map((k, i) => (
                      <Badge key={i} variant="cyan" className="text-[10px]">{k}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* BPM Stability + Beatgrid */}
            <Card className="p-5">
              <h4 className="font-display font-semibold text-sm text-text-primary mb-3">BPM Stability</h4>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={data.djPlayability.bpmStability.isStable ? 'green' : 'red'}>
                  {data.djPlayability.bpmStability.isStable ? 'Stable' : 'Unstable'}
                </Badge>
                <span className="text-xs text-text-secondary">±{data.djPlayability.bpmStability.variance.toFixed(2)} BPM variance</span>
              </div>
              <p className="text-xs text-text-secondary">{data.djPlayability.bpmStability.verdict}</p>
              <div className="mt-3 pt-3 border-t border-border-subtle flex items-center gap-2">
                <Badge variant={data.djPlayability.beatgridFriendly ? 'green' : 'amber'}>
                  Beatgrid {data.djPlayability.beatgridFriendly ? 'Friendly' : 'Challenging'}
                </Badge>
                <span className="text-xs text-text-muted">First beat clarity: {data.djPlayability.firstBeatClarity.score}/100</span>
              </div>
            </Card>

            {/* Loop Points */}
            {data.djPlayability.loopPoints?.length > 0 && (
              <Card className="p-5">
                <h4 className="font-display font-semibold text-sm text-text-primary mb-3">Loop Points</h4>
                <div className="space-y-2">
                  {data.djPlayability.loopPoints.map((lp, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-text-muted">{fmtTime(lp.time)}</span>
                        <span className="text-xs text-text-secondary">{lp.bars} bars</span>
                      </div>
                      <Badge variant={lp.quality === 'excellent' ? 'green' : lp.quality === 'good' ? 'cyan' : 'default'}>
                        {lp.quality}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Mixability Issues */}
          {data.djPlayability.mixabilityIssues?.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-display font-semibold text-sm text-text-primary mb-2">Mixability Issues</h4>
              {data.djPlayability.mixabilityIssues.map((issue, i) => (
                <div key={i} className="glass-card p-3">
                  <div className="flex items-start gap-3">
                    <Badge variant={issue.severity === 'critical' ? 'red' : issue.severity === 'warning' ? 'amber' : 'cyan'} className="shrink-0 mt-0.5">
                      {issue.severity}
                    </Badge>
                    <div>
                      <p className="text-xs text-text-primary mb-1">{issue.issue}</p>
                      <p className="text-xs text-text-muted">{issue.fix}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
