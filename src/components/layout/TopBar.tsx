import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, User, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'

export default function TopBar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="h-16 border-b border-border-subtle bg-bg-secondary/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div />
      <div className="flex items-center gap-4">
        <button
          className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.03] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-cyan" />
        </button>

        <div className="relative flex items-center gap-3">
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/30 capitalize">
            {user?.plan ?? 'Free'}
          </span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full bg-bg-tertiary border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors overflow-hidden"
            aria-label="User profile"
          >
            <User className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 w-56 glass-card p-2 space-y-1 shadow-xl">
              <div className="px-3 py-2 border-b border-border-subtle mb-1">
                <p className="text-sm text-text-primary font-body truncate">{user?.full_name ?? 'User'}</p>
                <p className="text-xs text-text-muted truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-accent-red hover:bg-white/[0.03] rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
