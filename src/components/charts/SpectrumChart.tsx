import { memo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { SpectrumDataPoint } from '@/types/analysis'
import { formatFrequency } from '@/lib/utils'

interface SpectrumChartProps {
  data: SpectrumDataPoint[]
  showReference?: boolean
  showGenreTarget?: boolean
  className?: string
  height?: number
}

const tickFrequencies = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000]

function SpectrumChartInner({ data, showReference = true, showGenreTarget = true, className, height = 320 }: SpectrumChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="spectrumUserGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.4} />
              <stop offset="40%" stopColor="#7C3AED" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="spectrumRefGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.01} />
            </linearGradient>
            <filter id="spectrumGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
          <XAxis
            dataKey="frequency"
            scale="log"
            domain={['dataMin', 'dataMax']}
            type="number"
            tickFormatter={formatFrequency}
            ticks={tickFrequencies}
            tick={{ fill: '#5A6A80', fontSize: 9, fontFamily: 'JetBrains Mono' }}
            stroke="rgba(255,255,255,0.04)"
            axisLine={{ stroke: 'rgba(255,255,255,0.04)' }}
          />
          <YAxis
            tickFormatter={(v: number) => `${v}dB`}
            tick={{ fill: '#5A6A80', fontSize: 9, fontFamily: 'JetBrains Mono' }}
            stroke="rgba(255,255,255,0.04)"
            axisLine={{ stroke: 'rgba(255,255,255,0.04)' }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(10, 16, 24, 0.95)',
              border: '1px solid rgba(0, 229, 255, 0.15)',
              borderRadius: 8,
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              color: '#E8EEFF',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            }}
            labelFormatter={(v) => formatFrequency(Number(v))}
          />
          <Legend
            wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#5A6A80' }}
          />
          <Area
            type="monotone"
            dataKey="userAmplitude"
            name="Your Track"
            stroke="#00E5FF"
            fill="url(#spectrumUserGrad)"
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1000}
            filter="url(#spectrumGlow)"
          />
          {showReference && (
            <Area
              type="monotone"
              dataKey="referenceAmplitude"
              name="Reference"
              stroke="#7C3AED"
              fill="url(#spectrumRefGrad)"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              isAnimationActive={true}
              animationDuration={1000}
            />
          )}
          {showGenreTarget && (
            <Area
              type="monotone"
              dataKey="genreTarget"
              name="Genre Target"
              stroke="#FFB800"
              fill="transparent"
              strokeWidth={1}
              strokeDasharray="4 4"
              strokeOpacity={0.6}
              isAnimationActive={true}
              animationDuration={1000}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const SpectrumChart = memo(SpectrumChartInner)
export default SpectrumChart
