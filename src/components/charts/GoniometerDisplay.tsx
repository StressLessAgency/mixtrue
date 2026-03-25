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
        <rect width={size} height={size} fill="#080C14" rx={8} />
        <line x1={center} y1={10} x2={center} y2={size - 10} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        <line x1={10} y1={center} x2={size - 10} y2={center} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        <circle cx={center} cy={center} r={scale * 0.5} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        <circle cx={center} cy={center} r={scale} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        <text x={center + 4} y={16} fill="#8896A8" fontSize={9} fontFamily="JetBrains Mono">M</text>
        <text x={size - 14} y={center - 4} fill="#8896A8" fontSize={9} fontFamily="JetBrains Mono">R</text>
        <text x={4} y={center - 4} fill="#8896A8" fontSize={9} fontFamily="JetBrains Mono">L</text>
        <text x={center + 4} y={size - 8} fill="#8896A8" fontSize={9} fontFamily="JetBrains Mono">S</text>

        {data.map((point, i) => (
          <circle
            key={i}
            cx={center + point.x * scale}
            cy={center - point.y * scale}
            r={1.2}
            fill="#00E5FF"
            opacity={0.5}
          />
        ))}
      </svg>
    </div>
  )
}

const GoniometerDisplay = memo(GoniometerDisplayInner)
export default GoniometerDisplay
