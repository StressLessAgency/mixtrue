import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '@/components/layout/PageTransition'
import ProcessingPipeline from '@/components/processing/ProcessingPipeline'
import DeletionReceipt from '@/components/processing/DeletionReceipt'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

const MAX_PROCESSING_TIME_MS = 60_000

export default function Processing() {
  const navigate = useNavigate()
  const { genre, analysisMode, file, sessionId } = useSessionStore()
  const [currentStage, setCurrentStage] = useState(0)
  const [stages, setStages] = useState<ProcessingStage[]>(mockStatusStages.stages)
  const [isComplete, setIsComplete] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [isTimedOut, setIsTimedOut] = useState(false)

  const totalStages = stages.length
  const progress = Math.min(100, (currentStage / totalStages) * 100)

  const reportId = sessionId ?? 'demo'

  // Safety timeout - prevent infinite stuck state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isComplete) {
        setIsTimedOut(true)
      }
    }, MAX_PROCESSING_TIME_MS)
    return () => clearTimeout(timeout)
  }, [isComplete])

  // Stage progression
  useEffect(() => {
    if (isTimedOut) return
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
  }, [currentStage, totalStages, isTimedOut])

  // Auto-redirect countdown after completion
  useEffect(() => {
    if (!isComplete) return
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate(`/app/report/${reportId}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isComplete, navigate, reportId])

  const handleRetry = useCallback(() => {
    setIsTimedOut(false)
    setIsComplete(false)
    setCurrentStage(0)
    setCountdown(3)
    setStages(mockStatusStages.stages)
  }, [])

  const handleSkipToReport = useCallback(() => {
    navigate(`/app/report/${reportId}`)
  }, [navigate, reportId])

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-2">Processing Your Track</h1>

        <div className="flex items-center gap-3 mb-8">
          <span className="text-sm text-text-secondary font-body">{file?.name ?? 'Midnight Protocol (Final Mix).wav'}</span>
          <Badge variant="cyan">{genre ?? 'techno'}</Badge>
          <Badge variant="purple">{analysisMode ?? 'both'}</Badge>
        </div>

        {isTimedOut ? (
          <div className="glass-card p-8 text-center space-y-4">
            <p className="text-accent-red font-display font-semibold">Processing Timed Out</p>
            <p className="text-sm text-text-secondary">
              The analysis is taking longer than expected. You can retry or skip to the report.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" size="md" onClick={handleRetry}>
                Retry
              </Button>
              <Button variant="primary" size="md" onClick={handleSkipToReport}>
                View Report
              </Button>
            </div>
          </div>
        ) : (
          <>
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
                <div className="text-center space-y-2">
                  <p className="text-sm text-text-secondary">
                    Redirecting to your report in{' '}
                    <span className="font-mono text-accent-cyan">{countdown}s</span>
                  </p>
                  <Button variant="outline" size="sm" onClick={handleSkipToReport}>
                    Go to Report Now
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  )
}
