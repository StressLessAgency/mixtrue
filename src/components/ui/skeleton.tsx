import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('rounded-lg skeleton-shimmer', className)}
      aria-hidden="true"
    />
  )
}
