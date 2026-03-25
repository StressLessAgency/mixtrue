import { Badge } from '@/components/ui/badge'

const mockSessions = [
  { id: 'a1b2c3d4', user: 'alex@producer.com', genre: 'techno', mode: 'both', score: 72, date: '2026-03-25', status: 'completed' },
  { id: 'b2c3d4e5', user: 'maya@beats.io', genre: 'hip-hop', mode: 'mixdown', score: 58, date: '2026-03-24', status: 'completed' },
  { id: 'c3d4e5f6', user: 'jin@studio.net', genre: 'house', mode: 'both', score: 84, date: '2026-03-24', status: 'completed' },
  { id: 'd4e5f6a7', user: 'kira@dj.club', genre: 'drum-and-bass', mode: 'master', score: null, date: '2026-03-25', status: 'processing' },
]

export default function SessionsTable() {
  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="text-left py-3 px-4 text-xs uppercase text-text-secondary font-display">Session ID</th>
            <th className="text-left py-3 px-4 text-xs uppercase text-text-secondary font-display">User</th>
            <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display">Genre</th>
            <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display">Mode</th>
            <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display">Score</th>
            <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display">Date</th>
            <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display">Status</th>
          </tr>
        </thead>
        <tbody>
          {mockSessions.map((s) => (
            <tr key={s.id} className="border-b border-border-subtle/50 hover:bg-white/[0.02]">
              <td className="py-3 px-4 font-mono text-accent-cyan text-xs">{s.id}</td>
              <td className="py-3 px-4 font-mono text-text-primary text-xs">{s.user}</td>
              <td className="py-3 px-4 text-center">
                <Badge variant="purple" className="text-[10px] capitalize">{s.genre}</Badge>
              </td>
              <td className="py-3 px-4 text-center font-mono text-text-secondary text-xs capitalize">{s.mode}</td>
              <td className="py-3 px-4 text-center font-mono text-text-primary">{s.score ?? '—'}</td>
              <td className="py-3 px-4 text-center font-mono text-text-secondary text-xs">{s.date}</td>
              <td className="py-3 px-4 text-center">
                <Badge
                  variant={s.status === 'completed' ? 'green' : 'amber'}
                  className="text-[10px] capitalize"
                >
                  {s.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
