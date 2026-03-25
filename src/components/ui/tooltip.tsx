import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: string
  children: ReactNode
  className?: string
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={cn(
            'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5',
            'rounded-lg bg-bg-tertiary border border-border-subtle',
            'text-xs text-text-secondary font-body whitespace-nowrap z-50',
            'animate-in fade-in-0 zoom-in-95',
            className
          )}
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-bg-tertiary border-r border-b border-border-subtle -mt-1" />
        </div>
      )}
    </div>
  )
}
