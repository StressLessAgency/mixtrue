import { Link, useLocation } from 'react-router-dom'
import { Upload, History, CreditCard, Shield, Activity, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/useAuthStore'

const navItems = [
  { path: '/app/upload', label: 'Upload', icon: Upload },
  { path: '/app/history', label: 'History', icon: History },
  { path: '/pricing', label: 'Pricing', icon: CreditCard },
  { path: '/admin', label: 'Admin', icon: Shield },
]

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const isPaid = user?.plan === 'pro' || user?.plan === 'legendary'
  const used = user?.analyses_this_month ?? 0
  const limit = isPaid ? 99 : 3
  const pct = Math.min((used / limit) * 100, 100)

  const handleNavClick = () => {
    onClose?.()
  }

  const sidebarContent = (
    <>
      <div className="p-5 border-b border-border-subtle flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group" onClick={handleNavClick}>
          <div className="w-9 h-9 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-accent-cyan" />
          </div>
          <span className="font-display font-bold text-lg text-text-primary tracking-tight">
            mixtrue
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 text-text-muted hover:text-text-primary" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all duration-200 relative',
                isActive
                  ? 'bg-accent-cyan/8 text-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.02]'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent-cyan rounded-r-full shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
              )}
              <Icon className={cn('w-4 h-4', isActive && 'drop-shadow-[0_0_4px_rgba(0,229,255,0.5)]')} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border-subtle space-y-3">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-text-muted">ANALYSES</span>
            <span className="text-text-secondary">{used}/{isPaid ? '∞' : limit}</span>
          </div>
          <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: pct > 80
                  ? 'linear-gradient(90deg, #FFB800, #FF3B5C)'
                  : 'linear-gradient(90deg, #00E5FF, #7C3AED)',
                boxShadow: pct > 80
                  ? '0 0 8px rgba(255, 59, 92, 0.4)'
                  : '0 0 8px rgba(0, 229, 255, 0.3)',
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_6px_rgba(0,255,157,0.5)]" />
          <span className="font-mono">System Online</span>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 sidebar-gradient border-r border-border-subtle flex-col z-40">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />
          <aside className="fixed left-0 top-0 h-screen w-64 sidebar-gradient border-r border-border-subtle flex flex-col z-50 md:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
