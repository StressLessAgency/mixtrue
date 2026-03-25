import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const mockUsers = [
  { id: '1', email: 'alex@producer.com', plan: 'pro', analyses: 24, joined: '2026-01-15' },
  { id: '2', email: 'maya@beats.io', plan: 'free', analyses: 3, joined: '2026-02-20' },
  { id: '3', email: 'jin@studio.net', plan: 'pro', analyses: 87, joined: '2025-11-03' },
  { id: '4', email: 'sam@mix.co', plan: 'free', analyses: 1, joined: '2026-03-10' },
  { id: '5', email: 'kira@dj.club', plan: 'pro', analyses: 42, joined: '2025-12-22' },
]

export default function UsersTable() {
  const [search, setSearch] = useState('')
  const filtered = mockUsers.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()))

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

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left py-3 px-4 text-xs uppercase text-text-secondary font-display">Email</th>
              <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display">Plan</th>
              <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display">Analyses</th>
              <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display">Joined</th>
              <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-border-subtle/50 hover:bg-white/[0.02]">
                <td className="py-3 px-4 font-mono text-text-primary text-xs">{user.email}</td>
                <td className="py-3 px-4 text-center">
                  <Badge variant={user.plan === 'pro' ? 'cyan' : 'default'} className="text-[10px] uppercase">
                    {user.plan}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-center font-mono text-text-secondary">{user.analyses}</td>
                <td className="py-3 px-4 text-center font-mono text-text-secondary text-xs">{user.joined}</td>
                <td className="py-3 px-4 text-center">
                  <Button variant="muted" size="sm" className="text-xs">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
