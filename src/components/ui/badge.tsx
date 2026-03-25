import { type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-bg-tertiary text-text-secondary border border-border-subtle',
        cyan: 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30',
        purple: 'bg-accent-purple/15 text-accent-purple border border-accent-purple/30',
        green: 'bg-accent-green/15 text-accent-green border border-accent-green/30',
        amber: 'bg-accent-amber/15 text-accent-amber border border-accent-amber/30',
        red: 'bg-accent-red/15 text-accent-red border border-accent-red/30',
        pink: 'bg-accent-pink/15 text-accent-pink border border-accent-pink/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
