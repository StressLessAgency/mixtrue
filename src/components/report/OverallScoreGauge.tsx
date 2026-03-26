import { useEffect, useState } from 'react'
import { getScoreColor } from '@/lib/utils'

interface OverallScoreGaugeProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
  className?: string
}

export default function OverallScoreGauge({
  score,
  size = 160,
  strokeWidth = 10,
  label,
  className,
}: OverallScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * Math.PI * 1.5
  const startAngle = 135
  const color = getScoreColor(score)

  useEffect(() => {
    const duration = 1200
    const startTime = performance.now()

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [score])

  const dashOffset = circumference - (animatedScore / 100) * circumference

  const glowId = `scoreGlow-${size}-${label?.replace(/\s/g, '') ?? 'default'}`

  return (
    <div className={`flex flex-col items-center gap-2 ${className ?? ''}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id={`${glowId}-bg`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity={0.06} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* Ambient glow behind gauge */}
        <circle cx={size / 2} cy={size / 2} r={radius * 0.85} fill={`url(#${glowId}-bg)`} />
        {/* Background arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${size / 2} ${size / 2})`}
        />
        {/* Glow trail (wider, blurred) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth + 6}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset + circumference * 0.25}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${size / 2} ${size / 2})`}
          opacity={0.15}
          filter={`url(#${glowId})`}
          style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
        />
        {/* Main progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset + circumference * 0.25}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${size / 2} ${size / 2})`}
          style={{
            filter: `drop-shadow(0 0 6px ${color}80)`,
            transition: 'stroke-dashoffset 0.1s ease-out',
          }}
        />
        {/* Score number */}
        <text
          x={size / 2}
          y={size / 2 - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-mono font-bold"
          style={{
            fontSize: size * 0.28,
            fill: color,
            filter: `drop-shadow(0 0 8px ${color}60)`,
          }}
        >
          {animatedScore}
        </text>
        <text
          x={size / 2}
          y={size / 2 + size * 0.13}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 10, fill: '#5A6A80' }}
          className="font-mono"
        >
          / 100
        </text>
      </svg>
      {label && (
        <span className="text-xs font-mono text-text-secondary tracking-wide uppercase">{label}</span>
      )}
    </div>
  )
}
