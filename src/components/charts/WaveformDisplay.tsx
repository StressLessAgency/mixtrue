import { memo } from 'react'

interface WaveformDataPoint {
  time: number
  amplitude: number
  isCompressed: boolean
  isClipping: boolean
}

interface WaveformDisplayProps {
  data: WaveformDataPoint[]
  className?: string
  height?: number
}

function WaveformDisplayInner({ data, className, height = 140 }: WaveformDisplayProps) {
  const barWidth = 2
  const gap = 1.5
  const width = data.length * (barWidth + gap)

  return (
    <div className={`overflow-x-auto ${className ?? ''}`}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="waveform-glow"
      >
        <defs>
          <linearGradient id="waveNormal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.9} />
            <stop offset="50%" stopColor="#7C3AED" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id="waveCompressed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFB800" stopOpacity={0.9} />
            <stop offset="50%" stopColor="#FF8C00" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#FFB800" stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id="waveClipping" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF3B5C" stopOpacity={1} />
            <stop offset="50%" stopColor="#FF2D78" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#FF3B5C" stopOpacity={0.3} />
          </linearGradient>
          <filter id="barGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Reflection (mirrored, dimmer) */}
        {data.map((point, i) => {
          const barHeight = point.amplitude * height * 0.38
          const x = i * (barWidth + gap)
          const y = height / 2
          let fill = 'url(#waveNormal)'
          if (point.isClipping) fill = 'url(#waveClipping)'
          else if (point.isCompressed) fill = 'url(#waveCompressed)'

          return (
            <rect
              key={`r${i}`}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={1}
              fill={fill}
              opacity={0.15}
            />
          )
        })}
        {/* Main bars */}
        {data.map((point, i) => {
          const barHeight = point.amplitude * height * 0.42
          const x = i * (barWidth + gap)
          const y = height / 2 - barHeight
          let fill = 'url(#waveNormal)'
          if (point.isClipping) fill = 'url(#waveClipping)'
          else if (point.isCompressed) fill = 'url(#waveCompressed)'

          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={1}
              fill={fill}
              filter={point.isClipping ? 'url(#barGlow)' : undefined}
              opacity={0.85}
            />
          )
        })}
        {/* Center line */}
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="rgba(0, 229, 255, 0.15)"
          strokeWidth={0.5}
        />
      </svg>
    </div>
  )
}

const WaveformDisplay = memo(WaveformDisplayInner)
export default WaveformDisplay
