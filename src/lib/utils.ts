import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--color-accent-green)'
  if (score >= 50) return 'var(--color-accent-amber)'
  return 'var(--color-accent-red)'
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Good'
  if (score >= 50) return 'Fair'
  return 'Poor'
}

export function formatFrequency(hz: number): string {
  if (hz >= 1000) return `${(hz / 1000).toFixed(hz >= 10000 ? 0 : 1)}kHz`
  return `${hz}Hz`
}

export function formatDb(db: number): string {
  return `${db > 0 ? '+' : ''}${db.toFixed(1)} dB`
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
