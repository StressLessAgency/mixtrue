import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-body font-medium text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-primary disabled:opacity-50 disabled:pointer-events-none cursor-pointer press-scale',
  {
    variants: {
      variant: {
        primary: 'bg-accent-cyan text-bg-primary hover:bg-accent-cyan/90 shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:shadow-[0_0_30px_rgba(0,229,255,0.35)] btn-shimmer',
        secondary: 'bg-accent-purple text-white hover:bg-accent-purple/90 shadow-[0_0_20px_rgba(124,58,237,0.25)] hover:shadow-[0_0_30px_rgba(124,58,237,0.35)] btn-shimmer',
        ghost: 'border border-border-accent text-accent-cyan hover:bg-accent-cyan/8 hover:border-accent-cyan/40',
        outline: 'border border-border-subtle text-text-primary hover:bg-white/[0.03] hover:border-white/[0.12]',
        danger: 'bg-accent-red text-white hover:bg-accent-red/90 shadow-[0_0_20px_rgba(255,59,92,0.2)]',
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
