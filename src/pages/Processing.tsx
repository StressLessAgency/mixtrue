import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '@/components/layout/PageTransition'
import ProcessingPipeline from '@/components/processing/ProcessingPipeline'
import DeletionReceipt from '@/components/processing/DeletionReceipt'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useSessionStore } from '@/stores/useSessionStore'
import { mockStatusStages, mockDeletionReceipt } from '@/services/mockData'
import type { ProcessingStage } from '@/types/analysis'

const operations = [
  'Encrypting audio file with AES-256...',
  'Spinning up ephemeral container...',
  'Running FFT spectral analysis...',
  'Computing RMS, LUFS, and crest factor...',
  'Analyzing stereo correlation and phase...',
  'Simulating club playback at 106dB SPL...',
  'Measuring true peak and codec resilience...',
  'Generating AI fix recommendations...',
  'Wiping temporary storage securely...',
]

export default function Processing() {
  const navigate = useNavigate()
  const { genre, analysisMode, file } = useSessionStore()
  const [currentStage, setCurrentStage] = useState(0)
  const [stages, setStages] = useState<ProcessingStage[]>(mockStatusStages.stages)
  const [isComplete, setIsComplete] = useState(false)
  const [countdown, setCountdown] = useState(3)

  const totalStages = stages.length
  const progress = Math.min(100, (currentStage / totalStages) * 100)

  useEffect(() => {
    if (currentStage >= totalStages) {
      setIsComplete(true)
      return
    }

    const timer = setTimeout(() => {
      setStages((prev) =>
        prev.map((s, i) =>
          i === currentStage ? { ...s, status: 'completed' as const } :
          i === currentStage + 1 ? { ...s, status: 'active' as const } : s
        )
      )
      setCurrentStage((prev) => prev + 1)
    }, 1200 + Math.random() * 800)

    return () => clearTimeout(timer)
  }, [currentStage, totalStages])

  useEffect(() => {
    if (!isComplete) return
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/app/report/a1b2c3d4-e5f6-7890-abcd-ef1234567890')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isComplete, navigate])

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-2">Processing Your Track</h1>

        <div className="flex items-center gap-3 mb-8">
          <span className="text-sm text-text-secondary font-body">{file?.name ?? 'Midnight Protocol (Final Mix).wav'}</span>
          <Badge variant="cyan">{genre ?? 'techno'}</Badge>
          <Badge variant="purple">{analysisMode ?? 'both'}</Badge>
        </div>

        <ProcessingPipeline stages={stages} currentStage={currentStage} />

        <div className="mt-8 space-y-3">
          <Progress value={progress} showLabel />
          <p className="text-xs text-text-secondary font-mono">
            {currentStage < totalStages ? operations[currentStage] : 'Analysis complete!'}
          </p>
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            <DeletionReceipt receipt={mockDeletionReceipt} />
            <div className="text-center">
              <p className="text-sm text-text-secondary">
                Redirecting to your report in{' '}
                <span className="font-mono text-accent-cyan">{countdown}s</span>
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}
