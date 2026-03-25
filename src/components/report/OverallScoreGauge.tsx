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

  return (
    <div className={`flex flex-col items-center gap-2 ${className ?? ''}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${size / 2} ${size / 2})`}
        />
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
            filter: `drop-shadow(0 0 8px ${color}50)`,
            transition: 'stroke-dashoffset 0.1s ease-out',
          }}
        />
        <text
          x={size / 2}
          y={size / 2 - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-mono font-bold"
          style={{ fontSize: size * 0.25, fill: color }}
        >
          {animatedScore}
        </text>
        <text
          x={size / 2}
          y={size / 2 + size * 0.12}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 11, fill: '#8896A8' }}
          className="font-body"
        >
          / 100
        </text>
      </svg>
      {label && (
        <span className="text-xs font-body text-text-secondary">{label}</span>
      )}
    </div>
  )
}
