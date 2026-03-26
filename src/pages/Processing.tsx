import { useState, useEffect, useCallback, useRef } from 'react'
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
import { analyzeWithGemini } from '@/services/geminiApi'
import type { ProcessingStage } from '@/types/analysis'

const USE_GEMINI = !!import.meta.env.VITE_GEMINI_API_KEY

const mockOperations = [
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

const MAX_PROCESSING_TIME_MS = 120_000

export default function Processing() {
  const navigate = useNavigate()
  const { genre, analysisMode, file, sessionId, setReport } = useSessionStore()
  const [currentStage, setCurrentStage] = useState(0)
  const [stages, setStages] = useState<ProcessingStage[]>(mockStatusStages.stages)
  const [isComplete, setIsComplete] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentOperation, setCurrentOperation] = useState(mockOperations[0])
  const geminiStarted = useRef(false)

  const totalStages = stages.length
  const progress = Math.min(100, (currentStage / totalStages) * 100)

  const reportId = sessionId ?? 'demo'

  // Safety timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isComplete && !error) {
        setIsTimedOut(true)
      }
    }, MAX_PROCESSING_TIME_MS)
    return () => clearTimeout(timeout)
  }, [isComplete, error])

  // Audio analysis
  useEffect(() => {
    if (!USE_GEMINI || !file || !genre || !analysisMode || geminiStarted.current) return
    geminiStarted.current = true

    const stageLabels: Record<string, number> = {
      'Converting audio for analysis...': 0,
      'Sending audio for deep analysis...': 2,
      'Processing analysis results...': 6,
    }

    analyzeWithGemini({
      file,
      genre,
      mode: analysisMode,
      onStageUpdate: (stage) => {
        setCurrentOperation(stage)
        const targetStage = stageLabels[stage]
        if (targetStage !== undefined) {
          // Advance stages up to the target
          setStages((prev) =>
            prev.map((s, i) =>
              i < targetStage ? { ...s, status: 'completed' as const } :
              i === targetStage ? { ...s, status: 'active' as const } : s
            )
          )
          setCurrentStage(targetStage)
        }
      },
    })
      .then((report) => {
        report.sessionId = reportId
        setReport(report)
        // Complete all stages
        setStages((prev) => prev.map((s) => ({ ...s, status: 'completed' as const })))
        setCurrentStage(totalStages)
        setCurrentOperation('Analysis complete!')
        setIsComplete(true)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Analysis failed')
      })
  }, [file, genre, analysisMode, reportId, setReport, totalStages])

  // Mock stage progression (only when not using Gemini)
  useEffect(() => {
    if (USE_GEMINI || isTimedOut || error) return
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
      setCurrentOperation(mockOperations[Math.min(currentStage + 1, mockOperations.length - 1)])
    }, 1200 + Math.random() * 800)

    return () => clearTimeout(timer)
  }, [currentStage, totalStages, isTimedOut, error])

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
    setError(null)
    setIsComplete(false)
    setCurrentStage(0)
    setCountdown(3)
    setCurrentOperation(mockOperations[0])
    setStages(mockStatusStages.stages)
    geminiStarted.current = false
  }, [])

  const handleSkipToReport = useCallback(() => {
    navigate(`/app/report/${reportId}`)
  }, [navigate, reportId])

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-2">
          Analyzing Your Track
        </h1>

        <div className="flex items-center gap-3 mb-8">
          <span className="text-sm text-text-secondary font-body">{file?.name ?? 'Midnight Protocol (Final Mix).wav'}</span>
          <Badge variant="cyan">{genre ?? 'techno'}</Badge>
          <Badge variant="purple">{analysisMode ?? 'both'}</Badge>
          {USE_GEMINI && <Badge variant="default">Deep Analysis</Badge>}
        </div>

        {error ? (
          <div className="glass-card p-8 text-center space-y-4">
            <p className="text-accent-red font-display font-semibold">Analysis Failed</p>
            <p className="text-sm text-text-secondary">{error}</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" size="md" onClick={handleRetry}>
                Retry
              </Button>
              {!USE_GEMINI && (
                <Button variant="primary" size="md" onClick={handleSkipToReport}>
                  View Report
                </Button>
              )}
            </div>
          </div>
        ) : isTimedOut ? (
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
                {currentOperation}
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
