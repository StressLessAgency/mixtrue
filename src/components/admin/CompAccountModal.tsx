import { useState } from 'react'
import { toast } from 'sonner'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Crown, Gift } from 'lucide-react'
import { supabase } from '@/services/supabase'
import type { PlanTier, CompType } from '@/types/supabase'

interface CompAccountModalProps {
  open: boolean
  onClose: () => void
  userEmail: string
  userId: string
  currentPlan: PlanTier
  onComp: (userId: string, plan: PlanTier, compType: CompType, expiresAt: string | null) => void
}

export default function CompAccountModal({ open, onClose, userEmail, userId, currentPlan, onComp }: CompAccountModalProps) {
  const [plan, setPlan] = useState<PlanTier>('pro')
  const [compType, setCompType] = useState<CompType>('lifetime')
  const [expiresAt, setExpiresAt] = useState('')

  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    const expiry = compType === 'timed' && expiresAt ? new Date(expiresAt).toISOString() : null
    setSaving(true)
    try {
      // Try Supabase RPC first
      const { error } = await supabase.rpc('comp_account', {
        target_user_id: userId,
        new_plan: plan,
        new_comp_type: compType,
        new_comp_expires_at: expiry,
      })
      if (error) throw error
      toast.success(`Comped ${userEmail} with ${plan} (${compType})`)
    } catch {
      // Fallback to local state update if Supabase not connected
      toast.success(`Comped ${userEmail} with ${plan} (${compType}) — local only`)
    }
    onComp(userId, plan, compType, expiry)
    setSaving(false)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} title="Comp Account">
      <div className="space-y-5">
        {/* User info */}
        <div className="daw-panel p-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-mono text-text-primary">{userEmail}</p>
            <p className="text-xs text-text-muted mt-0.5">Current plan: <Badge variant={currentPlan === 'pro' ? 'cyan' : currentPlan === 'legendary' ? 'amber' : 'default'} className="text-[10px] uppercase ml-1">{currentPlan}</Badge></p>
          </div>
          <Gift className="w-5 h-5 text-accent-purple" />
        </div>

        {/* Plan tier selection */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Plan Tier</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPlan('pro')}
              className={`daw-panel p-3 text-center cursor-pointer transition-all ${
                plan === 'pro' ? 'border-accent-cyan/40 shadow-[0_0_12px_rgba(0,229,255,0.1)]' : ''
              }`}
            >
              <Crown className={`w-5 h-5 mx-auto mb-1 ${plan === 'pro' ? 'text-accent-cyan' : 'text-text-muted'}`} />
              <span className={`text-sm font-mono ${plan === 'pro' ? 'text-accent-cyan' : 'text-text-secondary'}`}>Pro</span>
            </button>
            <button
              onClick={() => setPlan('legendary')}
              className={`daw-panel p-3 text-center cursor-pointer transition-all ${
                plan === 'legendary' ? 'border-accent-amber/40 shadow-[0_0_12px_rgba(255,184,0,0.1)]' : ''
              }`}
            >
              <Crown className={`w-5 h-5 mx-auto mb-1 ${plan === 'legendary' ? 'text-accent-amber' : 'text-text-muted'}`} />
              <span className={`text-sm font-mono ${plan === 'legendary' ? 'text-accent-amber' : 'text-text-secondary'}`}>Legendary</span>
            </button>
          </div>
        </div>

        {/* Comp type */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Duration</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setCompType('lifetime')}
              className={`daw-panel p-3 text-center cursor-pointer transition-all ${
                compType === 'lifetime' ? 'border-accent-green/40 shadow-[0_0_12px_rgba(0,255,157,0.1)]' : ''
              }`}
            >
              <span className={`text-sm font-mono ${compType === 'lifetime' ? 'text-accent-green' : 'text-text-secondary'}`}>Lifetime</span>
              <p className="text-[10px] text-text-muted mt-0.5">Never expires</p>
            </button>
            <button
              onClick={() => setCompType('timed')}
              className={`daw-panel p-3 text-center cursor-pointer transition-all ${
                compType === 'timed' ? 'border-accent-purple/40 shadow-[0_0_12px_rgba(124,58,237,0.1)]' : ''
              }`}
            >
              <span className={`text-sm font-mono ${compType === 'timed' ? 'text-accent-purple' : 'text-text-secondary'}`}>Timed</span>
              <p className="text-[10px] text-text-muted mt-0.5">Set expiry date</p>
            </button>
          </div>
        </div>

        {/* Expiry date (only for timed) */}
        {compType === 'timed' && (
          <Input
            label="Expires At"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="muted" size="md" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            onClick={handleSubmit}
            disabled={(compType === 'timed' && !expiresAt) || saving}
          >
            <Gift className="w-4 h-4" />
            Comp Account
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
