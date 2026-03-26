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
  'Generating fix recommendations...',
  'Wiping temporary storage securely...',
]

export default function Processing() {
  const navigate = useNavigate()
  const { genre, analysisMode, file, sessionId } = useSessionStore()
  const [currentStage, setCurrentStage] = useState(0)
  const [stages, setStages] = useState<ProcessingStage[]>(
    mockStatusStages.stages.map((s, i) => i === 0 ? { ...s, status: 'active' as const } : s)
  )
  const [done, setDone] = useState(false)
  const [countdown, setCountdown] = useState(3)

  const total = stages.length
  const pct = Math.round((currentStage / total) * 100)
  const reportPath = `/app/report/${sessionId ?? 'demo'}`

  // Simple timer: advance one stage every 1.5s
  useEffect(() => {
    if (done) return
    if (currentStage >= total) {
      setDone(true)
      return
    }
    const id = setTimeout(() => {
      setStages(prev => prev.map((s, i) =>
        i === currentStage ? { ...s, status: 'completed' as const } :
        i === currentStage + 1 ? { ...s, status: 'active' as const } : s
      ))
      setCurrentStage(n => n + 1)
    }, 1500)
    return () => clearTimeout(id)
  }, [currentStage, total, done])

  // Countdown then navigate
  useEffect(() => {
    if (!done) return
    const id = setInterval(() => {
      setCountdown(n => {
        if (n <= 1) {
          clearInterval(id)
          navigate(reportPath)
          return 0
        }
        return n - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [done, navigate, reportPath])

  const goToReport = useCallback(() => navigate(reportPath), [navigate, reportPath])

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-2">
          Analyzing Your Track
        </h1>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-sm text-text-secondary font-body truncate max-w-[200px]">
            {file?.name ?? 'Demo Track'}
          </span>
          <Badge variant="cyan">{genre ?? 'techno'}</Badge>
          <Badge variant="purple">{analysisMode ?? 'both'}</Badge>
        </div>

        <ProcessingPipeline stages={stages} currentStage={currentStage} />

        <div className="mt-8 space-y-3">
          <Progress value={pct} showLabel />
          <p className="text-xs text-text-secondary font-mono">
            {currentStage < total ? operations[currentStage] ?? 'Processing...' : 'Analysis complete!'}
          </p>
        </div>

        {/* Skip button after a few stages */}
        {!done && currentStage >= 2 && (
          <div className="mt-6 text-center">
            <Button variant="muted" size="sm" onClick={goToReport}>
              Skip to report
            </Button>
          </div>
        )}

        {done && (
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
              <Button variant="outline" size="sm" onClick={goToReport}>
                Go to Report Now
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}
