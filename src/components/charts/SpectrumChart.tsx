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
}

const tickFrequencies = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000]

function SpectrumChartInner({ data, showReference = true, showGenreTarget = true, className }: SpectrumChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="frequency"
            scale="log"
            domain={['dataMin', 'dataMax']}
            type="number"
            tickFormatter={formatFrequency}
            ticks={tickFrequencies}
            tick={{ fill: '#8896A8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            stroke="rgba(255,255,255,0.06)"
          />
          <YAxis
            tickFormatter={(v: number) => `${v}dB`}
            tick={{ fill: '#8896A8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            stroke="rgba(255,255,255,0.06)"
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              background: '#0D1421',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8,
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              color: '#F0F4FF',
            }}
            labelFormatter={(v) => formatFrequency(Number(v))}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, fontFamily: 'DM Sans', color: '#8896A8' }}
          />
          <Area
            type="monotone"
            dataKey="userAmplitude"
            name="Your Track"
            stroke="#00E5FF"
            fill="url(#userGrad)"
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={800}
          />
          {showReference && (
            <Area
              type="monotone"
              dataKey="referenceAmplitude"
              name="Reference"
              stroke="#7C3AED"
              fill="transparent"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              isAnimationActive={true}
              animationDuration={800}
            />
          )}
          {showGenreTarget && (
            <Area
              type="monotone"
              dataKey="genreTarget"
              name="Genre Target"
              stroke="#FFB800"
              fill="transparent"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              isAnimationActive={true}
              animationDuration={800}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const SpectrumChart = memo(SpectrumChartInner)
export default SpectrumChart
