import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/services/supabase'

interface Session {
  id: string
  user_email: string
  genre_mode: string
  analysis_mode: string
  overall_score: number | null
  created_at: string
  status: string
}

export default function SessionsTable() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSessions() {
      try {
        const { data, error } = await supabase
          .from('analysis_sessions')
          .select(`
            id,
            genre_mode,
            analysis_mode,
            overall_score,
            created_at,
            user_id
          `)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) throw error

        // Fetch user emails for the sessions
        const userIds = [...new Set((data ?? []).map((s) => s.user_id))]
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', userIds)

        const emailMap = new Map((profiles ?? []).map((p) => [p.id, p.email]))

        setSessions(
          (data ?? []).map((s) => ({
            id: s.id.substring(0, 8),
            user_email: emailMap.get(s.user_id) ?? 'Unknown',
            genre_mode: s.genre_mode ?? '—',
            analysis_mode: s.analysis_mode ?? '—',
            overall_score: s.overall_score,
            created_at: new Date(s.created_at).toLocaleDateString(),
            status: s.overall_score !== null ? 'completed' : 'processing',
          }))
        )
      } catch {
        // No data available - show empty state
        setSessions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  if (loading) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-6 h-6 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-text-muted font-mono">Loading sessions...</p>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-sm text-text-muted">No analysis sessions yet.</p>
      </div>
    )
  }

  return (
    <div className="glass-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="text-left py-3 px-4 text-xs uppercase text-text-secondary font-display">Session</th>
            <th className="text-left py-3 px-4 text-xs uppercase text-text-secondary font-display hidden md:table-cell">User</th>
            <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display">Genre</th>
            <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display hidden sm:table-cell">Mode</th>
            <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display">Score</th>
            <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display hidden sm:table-cell">Date</th>
            <th className="text-center py-3 px-4 text-xs uppercase text-text-secondary font-display">Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} className="border-b border-border-subtle/50 hover:bg-white/[0.02]">
              <td className="py-3 px-4 font-mono text-accent-cyan text-xs">{s.id}</td>
              <td className="py-3 px-4 font-mono text-text-primary text-xs hidden md:table-cell">{s.user_email}</td>
              <td className="py-3 px-4 text-center">
                <Badge variant="purple" className="text-[10px] capitalize">{s.genre_mode}</Badge>
              </td>
              <td className="py-3 px-4 text-center font-mono text-text-secondary text-xs capitalize hidden sm:table-cell">{s.analysis_mode}</td>
              <td className="py-3 px-4 text-center font-mono text-text-primary">{s.overall_score ?? '—'}</td>
              <td className="py-3 px-4 text-center font-mono text-text-secondary text-xs hidden sm:table-cell">{s.created_at}</td>
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
