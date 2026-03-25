import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-body text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full h-10 px-3 rounded-lg bg-bg-tertiary border text-text-primary font-body text-sm',
            'placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan/50',
            'transition-colors duration-200',
            error ? 'border-accent-red' : 'border-border-subtle',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-accent-red">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
