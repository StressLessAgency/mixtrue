import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, Shield, Clock } from 'lucide-react'
import type { ProcessingStage } from '@/types/analysis'
import { cn } from '@/lib/utils'

interface ProcessingPipelineProps {
  stages: ProcessingStage[]
  currentStage: number
}

export default function ProcessingPipeline({ stages, currentStage }: ProcessingPipelineProps) {
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {stages.map((stage, i) => {
          const isActive = i === currentStage
          const isCompleted = i < currentStage
          const isPending = i > currentStage
          const isDeletion = stage.id === 9

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className={cn(
                'glass-card p-4 flex items-center gap-4 transition-all',
                isActive && 'border-accent-cyan/30',
                isCompleted && isDeletion && 'border-accent-green/30',
                isCompleted && !isDeletion && 'border-accent-green/20',
              )}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      isDeletion ? 'bg-accent-green/20' : 'bg-accent-green/15'
                    )}
                  >
                    {isDeletion ? (
                      <Shield className="w-4 h-4 text-accent-green" />
                    ) : (
                      <Check className="w-4 h-4 text-accent-green" />
                    )}
                  </motion.div>
                ) : isActive ? (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-8 h-8 rounded-full bg-accent-cyan/15 flex items-center justify-center"
                  >
                    <Loader2 className="w-4 h-4 text-accent-cyan animate-spin" />
                  </motion.div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center">
                    <Clock className="w-4 h-4 text-text-muted" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className={cn(
                  'text-sm font-body',
                  isActive ? 'text-accent-cyan' : isCompleted ? 'text-text-primary' : 'text-text-muted'
                )}>
                  {stage.label}
                </p>
                {isCompleted && isDeletion && (
                  <p className="text-xs text-accent-green mt-0.5">File permanently deleted</p>
                )}
              </div>

              <span className={cn(
                'text-xs font-mono',
                isPending ? 'text-text-muted' : isActive ? 'text-accent-cyan' : 'text-accent-green'
              )}>
                {isPending ? 'Waiting' : isActive ? 'Processing' : 'Done'}
              </span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
