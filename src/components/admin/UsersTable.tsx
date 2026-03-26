import { useState } from 'react'
import { Search, Gift } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CompAccountModal from './CompAccountModal'
import type { PlanTier, CompType } from '@/types/supabase'

interface MockUser {
  id: string
  email: string
  plan: PlanTier
  comp_type: CompType
  comp_expires_at: string | null
  analyses: number
  joined: string
}

const initialUsers: MockUser[] = [
  { id: '1', email: 'alex@producer.com', plan: 'pro', comp_type: 'none', comp_expires_at: null, analyses: 24, joined: '2026-01-15' },
  { id: '2', email: 'maya@beats.io', plan: 'free', comp_type: 'none', comp_expires_at: null, analyses: 3, joined: '2026-02-20' },
  { id: '3', email: 'jin@studio.net', plan: 'legendary', comp_type: 'lifetime', comp_expires_at: null, analyses: 87, joined: '2025-11-03' },
  { id: '4', email: 'sam@mix.co', plan: 'free', comp_type: 'none', comp_expires_at: null, analyses: 1, joined: '2026-03-10' },
  { id: '5', email: 'kira@dj.club', plan: 'pro', comp_type: 'timed', comp_expires_at: '2026-06-30', analyses: 42, joined: '2025-12-22' },
]

function getPlanBadgeVariant(plan: PlanTier) {
  if (plan === 'legendary') return 'amber' as const
  if (plan === 'pro') return 'cyan' as const
  return 'default' as const
}

export default function UsersTable() {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState(initialUsers)
  const [compModal, setCompModal] = useState<{ open: boolean; user: MockUser | null }>({ open: false, user: null })

  const filtered = users.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()))

  const handleComp = (userId: string, plan: PlanTier, compType: CompType, expiresAt: string | null) => {
    setUsers((prev) => prev.map((u) =>
      u.id === userId ? { ...u, plan, comp_type: compType, comp_expires_at: expiresAt } : u
    ))
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
          aria-label="Search users"
        />
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left py-3 px-4 text-xs uppercase text-text-secondary font-display">Email</th>
              <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display">Plan</th>
              <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display hidden sm:table-cell">Comp</th>
              <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display hidden md:table-cell">Analyses</th>
              <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display hidden md:table-cell">Joined</th>
              <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-border-subtle/50 hover:bg-white/[0.02]">
                <td className="py-3 px-4 font-mono text-text-primary text-xs">{user.email}</td>
                <td className="py-3 px-4 text-center">
                  <Badge variant={getPlanBadgeVariant(user.plan)} className="text-[10px] uppercase">
                    {user.plan}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-center hidden sm:table-cell">
                  {user.comp_type === 'lifetime' && (
                    <Badge variant="green" className="text-[10px]">LIFETIME</Badge>
                  )}
                  {user.comp_type === 'timed' && (
                    <Badge variant="purple" className="text-[10px]">
                      Until {user.comp_expires_at}
                    </Badge>
                  )}
                  {user.comp_type === 'none' && (
                    <span className="text-text-muted text-xs">--</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center font-mono text-text-secondary hidden md:table-cell">{user.analyses}</td>
                <td className="py-3 px-4 text-center font-mono text-text-secondary text-xs hidden md:table-cell">{user.joined}</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex gap-1 justify-center">
                    <Button variant="muted" size="sm" className="text-xs">View</Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setCompModal({ open: true, user })}
                    >
                      <Gift className="w-3 h-3" />
                      Comp
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {compModal.user && (
        <CompAccountModal
          open={compModal.open}
          onClose={() => setCompModal({ open: false, user: null })}
          userEmail={compModal.user.email}
          userId={compModal.user.id}
          currentPlan={compModal.user.plan}
          onComp={handleComp}
        />
      )}
    </div>
  )
}
