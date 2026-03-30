import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
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
  /** Controlled mode: when provided, this value overrides internal state */
  value?: string
  children: ReactNode
  className?: string
  onValueChange?: (value: string) => void
}

export function Tabs({ defaultValue, value, children, className, onValueChange }: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultValue)

  // Sync internal state when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalTab(value)
    }
  }, [value])

  const activeTab = value !== undefined ? value : internalTab

  const handleChange = (tab: string) => {
    if (value === undefined) {
      // Uncontrolled mode — manage our own state
      setInternalTab(tab)
    }
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
        'flex gap-1 border-b border-border-subtle overflow-x-auto',
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
        'px-4 py-2.5 text-sm font-body whitespace-nowrap transition-all duration-200 relative cursor-pointer',
        isActive
          ? 'text-accent-cyan'
          : 'text-text-secondary hover:text-text-primary',
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan rounded-full" />
      )}
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
