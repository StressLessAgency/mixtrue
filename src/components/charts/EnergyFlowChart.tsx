import { memo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts'
import type { EnergyDataPoint, EnergySection } from '@/types/analysis'
import { formatTime } from '@/lib/utils'

interface EnergyFlowChartProps {
  data: EnergyDataPoint[]
  sections: EnergySection[]
  className?: string
}

function EnergyFlowChartInner({ data, sections, className }: EnergyFlowChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF2D78" stopOpacity={0.5} />
              <stop offset="40%" stopColor="#7C3AED" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#FF2D78" stopOpacity={0.01} />
            </linearGradient>
            <filter id="energyGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <XAxis
            dataKey="time"
            tickFormatter={formatTime}
            tick={{ fill: '#8896A8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            stroke="rgba(255,255,255,0.06)"
          />
          <YAxis hide domain={[0, 1.1]} />
          {sections.map((section) => (
            <ReferenceArea
              key={section.label}
              x1={section.start}
              x2={section.end}
              fill={section.color}
              fillOpacity={0.05}
              label={{
                value: section.label,
                position: 'insideTop',
                fill: section.color,
                fontSize: 10,
                fontFamily: 'JetBrains Mono',
              }}
            />
          ))}
          <Area
            type="monotone"
            dataKey="energy"
            stroke="#FF2D78"
            fill="url(#energyGrad)"
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1000}
            filter="url(#energyGlow)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const EnergyFlowChart = memo(EnergyFlowChartInner)
export default EnergyFlowChart
