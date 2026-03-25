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

function WaveformDisplayInner({ data, className, height = 120 }: WaveformDisplayProps) {
  const width = data.length * 4
  const barWidth = 2.5
  const gap = 1.5

  return (
    <div className={`overflow-x-auto ${className ?? ''}`}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {data.map((point, i) => {
          const barHeight = point.amplitude * height * 0.9
          const x = i * (barWidth + gap)
          const y = (height - barHeight) / 2
          let fill = '#00E5FF'
          if (point.isClipping) fill = '#FF3B5C'
          else if (point.isCompressed) fill = '#FFB800'

          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={1}
              fill={fill}
              opacity={0.8}
            />
          )
        })}
      </svg>
    </div>
  )
}

const WaveformDisplay = memo(WaveformDisplayInner)
export default WaveformDisplay
