import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-body font-medium text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-accent-cyan text-bg-primary hover:bg-accent-cyan/90 glow-cyan',
        secondary: 'bg-accent-purple text-white hover:bg-accent-purple/90 glow-purple',
        ghost: 'border border-border-accent text-accent-cyan hover:bg-accent-cyan/10',
        outline: 'border border-border-subtle text-text-primary hover:bg-white/[0.03]',
        danger: 'bg-accent-red text-white hover:bg-accent-red/90',
        muted: 'bg-bg-tertiary text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/80',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
