import { Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface PaywallOverlayProps {
  feature: string
}

export default function PaywallOverlay({ feature }: PaywallOverlayProps) {
  return (
    <div className="relative min-h-[300px]">
      {/* Blurred placeholder */}
      <div className="absolute inset-0 opacity-20 blur-md pointer-events-none">
        <div className="p-8 space-y-4">
          <div className="h-8 w-48 rounded bg-bg-tertiary" />
          <div className="h-40 rounded bg-bg-tertiary" />
          <div className="h-20 rounded bg-bg-tertiary" />
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center glass-card bg-bg-glass/90 z-10">
        <div className="w-16 h-16 rounded-2xl bg-accent-purple/10 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-accent-purple" />
        </div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-2">
          {feature} — Pro Only
        </h3>
        <p className="text-sm text-text-secondary mb-6 text-center max-w-sm">
          Upgrade to Pro to unlock {feature.toLowerCase()}, reference track A/B, and unlimited analyses.
        </p>
        <Link to="/pricing">
          <Button variant="secondary" size="lg">
            Upgrade to Pro
          </Button>
        </Link>
      </div>
    </div>
  )
}
