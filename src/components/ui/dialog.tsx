import { type ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  title?: string
}

export function Dialog({ open, onClose, children, className, title }: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [open])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      window.addEventListener('keydown', handleEsc)
      return () => window.removeEventListener('keydown', handleEsc)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
              'glass-card p-6 w-full max-w-lg max-h-[85vh] overflow-auto',
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-lg text-text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded text-text-muted hover:text-text-primary transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
