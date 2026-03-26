import { memo } from 'react'
import type { GoniometerPoint } from '@/types/analysis'

interface GoniometerDisplayProps {
  data: GoniometerPoint[]
  size?: number
  className?: string
}

function GoniometerDisplayInner({ data, size = 280, className }: GoniometerDisplayProps) {
  const center = size / 2
  const scale = size * 0.4

  return (
    <div className={className}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id="gonioCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.06} />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity={0} />
          </radialGradient>
          <filter id="dotGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={size} height={size} fill="#060a10" rx={8} />
        {/* Ambient center glow */}
        <circle cx={center} cy={center} r={scale * 1.1} fill="url(#gonioCenter)" />
        {/* Grid */}
        <line x1={center} y1={10} x2={center} y2={size - 10} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
        <line x1={10} y1={center} x2={size - 10} y2={center} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
        {/* Diagonal guides */}
        <line x1={center - scale} y1={center - scale} x2={center + scale} y2={center + scale} stroke="rgba(255,255,255,0.03)" strokeWidth={0.5} />
        <line x1={center + scale} y1={center - scale} x2={center - scale} y2={center + scale} stroke="rgba(255,255,255,0.03)" strokeWidth={0.5} />
        {/* Circles */}
        <circle cx={center} cy={center} r={scale * 0.33} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={0.5} />
        <circle cx={center} cy={center} r={scale * 0.66} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={0.5} />
        <circle cx={center} cy={center} r={scale} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
        {/* Labels */}
        <text x={center + 4} y={14} fill="#5A6A80" fontSize={8} fontFamily="JetBrains Mono">M</text>
        <text x={size - 12} y={center - 4} fill="#5A6A80" fontSize={8} fontFamily="JetBrains Mono">R</text>
        <text x={4} y={center - 4} fill="#5A6A80" fontSize={8} fontFamily="JetBrains Mono">L</text>
        <text x={center + 4} y={size - 6} fill="#5A6A80" fontSize={8} fontFamily="JetBrains Mono">S</text>
        {/* Data points */}
        {data.map((point, i) => {
          const dist = Math.sqrt(point.x * point.x + point.y * point.y)
          const opacity = 0.3 + dist * 0.4
          return (
            <circle
              key={i}
              cx={center + point.x * scale}
              cy={center - point.y * scale}
              r={1.2}
              fill="#00E5FF"
              opacity={opacity}
              filter={dist > 0.6 ? 'url(#dotGlow)' : undefined}
            />
          )
        })}
      </svg>
    </div>
  )
}

const GoniometerDisplay = memo(GoniometerDisplayInner)
export default GoniometerDisplay
