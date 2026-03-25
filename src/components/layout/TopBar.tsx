import { Bell, User } from 'lucide-react'

export default function TopBar() {
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

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
            Free
          </span>
          <button
            className="w-8 h-8 rounded-full bg-bg-tertiary border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="User profile"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
