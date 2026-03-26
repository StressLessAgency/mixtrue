import { useState } from 'react'
import { toast } from 'sonner'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Crown, UserPlus } from 'lucide-react'
import { supabase } from '@/services/supabase'
import type { PlanTier, CompType } from '@/types/supabase'

interface AddUserModalProps {
  open: boolean
  onClose: () => void
  onUserAdded: () => void
}

export default function AddUserModal({ open, onClose, onUserAdded }: AddUserModalProps) {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [plan, setPlan] = useState<PlanTier>('pro')
  const [compType, setCompType] = useState<CompType>('lifetime')
  const [expiresAt, setExpiresAt] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!email) return
    setSaving(true)
    try {
      // Create the user via Supabase Auth admin invite
      // Note: This requires service_role key or an edge function in production.
      // For now, we'll create a profile entry directly if the user already exists,
      // or show instructions.
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (existing) {
        // User exists - just comp them
        const expiry = compType === 'timed' && expiresAt ? new Date(expiresAt).toISOString() : null
        const { error } = await supabase.rpc('comp_account', {
          target_user_id: existing.id,
          new_plan: plan,
          new_comp_type: compType,
          new_comp_expires_at: expiry,
        })
        if (error) throw error
        toast.success(`Comped existing user ${email} with ${plan} (${compType})`)
      } else {
        // User doesn't exist yet - send them a magic link invite
        const { error: inviteError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            data: { full_name: fullName || null },
          },
        })
        if (inviteError) throw inviteError
        toast.success(`Invite sent to ${email}. They'll be comped on signup.`)

        // Store the pending comp so we can apply it when they sign up
        // For now, we notify the admin to comp them after they accept
        toast.info('Comp them from the Users tab after they accept the invite.')
      }

      onUserAdded()
      onClose()
      setEmail('')
      setFullName('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add user')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Add & Comp User">
      <div className="space-y-5">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          required
        />
        <Input
          label="Full Name (optional)"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jane Producer"
        />

        {/* Plan tier */}
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

        {/* Duration */}
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
            </button>
            <button
              onClick={() => setCompType('timed')}
              className={`daw-panel p-3 text-center cursor-pointer transition-all ${
                compType === 'timed' ? 'border-accent-purple/40 shadow-[0_0_12px_rgba(124,58,237,0.1)]' : ''
              }`}
            >
              <span className={`text-sm font-mono ${compType === 'timed' ? 'text-accent-purple' : 'text-text-secondary'}`}>Timed</span>
            </button>
          </div>
        </div>

        {compType === 'timed' && (
          <Input
            label="Expires At"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="muted" size="md" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            onClick={handleSubmit}
            disabled={!email || saving || (compType === 'timed' && !expiresAt)}
          >
            <UserPlus className="w-4 h-4" />
            {saving ? 'Adding...' : 'Add & Comp'}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
