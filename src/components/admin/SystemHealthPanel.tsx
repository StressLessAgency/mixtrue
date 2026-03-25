import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Users, DollarSign, TrendingUp, Clock, Layers } from 'lucide-react'

const stats = [
  { icon: Activity, label: 'API Status', value: 'Online', badge: 'green' as const },
  { icon: TrendingUp, label: 'Uptime', value: '99.97%', badge: 'green' as const },
  { icon: Clock, label: 'Avg Analysis Time', value: '34s', badge: 'cyan' as const },
  { icon: Layers, label: 'Queue Depth', value: '3', badge: 'cyan' as const },
  { icon: DollarSign, label: 'MRR', value: '$4,280', badge: 'green' as const },
  { icon: Users, label: 'Active Subscribers', value: '226', badge: 'purple' as const },
]

export default function SystemHealthPanel() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center">
                <Icon className="w-4 h-4 text-text-muted" />
              </div>
              <span className="text-xs text-text-secondary font-body">{stat.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-mono font-bold text-text-primary">{stat.value}</span>
              <Badge variant={stat.badge} className="text-[10px]">
                {stat.badge === 'green' ? 'Healthy' : 'Active'}
              </Badge>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
