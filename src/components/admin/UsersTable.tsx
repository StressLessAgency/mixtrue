import { useState, useEffect } from 'react'
import { Search, Gift } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CompAccountModal from './CompAccountModal'
import { supabase } from '@/services/supabase'
import type { PlanTier, CompType } from '@/types/supabase'

interface UserRow {
  id: string
  email: string
  plan: PlanTier
  comp_type: CompType
  comp_expires_at: string | null
  analyses_this_month: number
  created_at: string
}

function getPlanBadgeVariant(plan: PlanTier) {
  if (plan === 'legendary') return 'amber' as const
  if (plan === 'pro') return 'cyan' as const
  return 'default' as const
}

export default function UsersTable() {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [compModal, setCompModal] = useState<{ open: boolean; user: UserRow | null }>({ open: false, user: null })

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, plan, comp_type, comp_expires_at, analyses_this_month, created_at')
          .order('created_at', { ascending: false })
          .limit(100)

        if (error) throw error

        setUsers(
          (data ?? []).map((u) => ({
            id: u.id,
            email: u.email ?? '',
            plan: (u.plan ?? 'free') as PlanTier,
            comp_type: (u.comp_type ?? 'none') as CompType,
            comp_expires_at: u.comp_expires_at,
            analyses_this_month: u.analyses_this_month ?? 0,
            created_at: new Date(u.created_at).toLocaleDateString(),
          }))
        )
      } catch {
        // Supabase not connected - show empty state
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filtered = users.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()))

  const handleComp = (userId: string, plan: PlanTier, compType: CompType, expiresAt: string | null) => {
    setUsers((prev) => prev.map((u) =>
      u.id === userId ? { ...u, plan, comp_type: compType, comp_expires_at: expiresAt } : u
    ))
  }

  if (loading) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-6 h-6 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-text-muted font-mono">Loading users...</p>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-sm text-text-muted">No users found. Make sure Supabase is connected and the schema is set up.</p>
      </div>
    )
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
                  {user.comp_type === 'timed' && user.comp_expires_at && (
                    <Badge variant="purple" className="text-[10px]">
                      Until {new Date(user.comp_expires_at).toLocaleDateString()}
                    </Badge>
                  )}
                  {user.comp_type === 'none' && (
                    <span className="text-text-muted text-xs">--</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center font-mono text-text-secondary hidden md:table-cell">{user.analyses_this_month}</td>
                <td className="py-3 px-4 text-center font-mono text-text-secondary text-xs hidden md:table-cell">{user.created_at}</td>
                <td className="py-3 px-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setCompModal({ open: true, user })}
                  >
                    <Gift className="w-3 h-3" />
                    Comp
                  </Button>
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
