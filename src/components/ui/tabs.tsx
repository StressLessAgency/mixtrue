import { createContext, useContext, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs components must be used within a Tabs provider')
  return ctx
}

interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string
  onValueChange?: (value: string) => void
}

export function Tabs({ defaultValue, children, className, onValueChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  const handleChange = (tab: string) => {
    setActiveTab(tab)
    onValueChange?.(tab)
  }

  return (
    <TabsContext value={{ activeTab, setActiveTab: handleChange }}>
      <div className={className}>{children}</div>
    </TabsContext>
  )
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        'flex gap-0.5 daw-panel p-1 overflow-x-auto rounded-lg',
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
  disabled?: boolean
}

export function TabsTrigger({ value, children, className, disabled }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabs()
  const isActive = activeTab === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      className={cn(
        'px-3 py-2 text-xs font-mono whitespace-nowrap shrink-0 transition-all duration-200 relative cursor-pointer rounded-md uppercase tracking-wider',
        isActive
          ? 'text-accent-cyan bg-accent-cyan/8 shadow-[0_0_12px_rgba(0,229,255,0.1)]'
          : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.02]',
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabs()
  if (activeTab !== value) return null
  return <div className={cn('pt-6', className)}>{children}</div>
}
