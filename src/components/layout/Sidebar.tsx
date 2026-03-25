import { Link, useLocation } from 'react-router-dom'
import { Upload, History, CreditCard, Shield, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/app/upload', label: 'Upload', icon: Upload },
  { path: '/app/history', label: 'History', icon: History },
  { path: '/pricing', label: 'Pricing', icon: CreditCard },
  { path: '/admin', label: 'Admin', icon: Shield },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-bg-secondary border-r border-border-subtle flex flex-col z-40">
      <div className="p-6 border-b border-border-subtle">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-accent-cyan" />
          </div>
          <span className="font-display font-bold text-lg text-text-primary">
            mixtrue<span className="text-accent-cyan"> AI</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all duration-200',
                isActive
                  ? 'bg-accent-cyan/10 text-accent-cyan border-l-2 border-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03] hover:translate-x-0.5'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border-subtle">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span>2 of 3 analyses used</span>
        </div>
      </div>
    </aside>
  )
}
