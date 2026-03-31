import logoSvg from '@/assets/logo.svg'
import { cn } from '@/lib/utils'

const sizes = {
  xs: 'h-4',
  sm: 'h-5',
  md: 'h-7',
  lg: 'h-9',
  xl: 'h-12',
} as const

interface LogoProps {
  size?: keyof typeof sizes
  className?: string
}

export default function Logo({ size = 'md', className }: LogoProps) {
  return (
    <img
      src={logoSvg}
      alt="mixtrue"
      className={cn(sizes[size], 'w-auto brightness-0 invert', className)}
    />
  )
}
