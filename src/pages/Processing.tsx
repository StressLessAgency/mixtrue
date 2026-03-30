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
import { useAuthStore } from '@/stores/useAuthStore'
import { mockStatusStages, mockDeletionReceipt } from '@/services/mockData'
import { analyzeWithGemini } from '@/services/geminiApi'
import { saveAnalysisToHistory, persistReportForSession } from '@/services/historyService'
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
  'Generating AI fix recommendations...',
  'Wiping temporary storage securely...',
]

// Staggered delays (ms) per stage for the Gemini ticker.
// Total ~55 s — leaves comfortable headroom for most real analysis times.
const GEMINI_STAGE_DELAYS_MS = [3000, 5000, 8000, 12000, 16000, 20000, 25000, 32000]

const MAX_PROCESSING_TIME_MS = 120_000

export default function Processing() {
  const navigate = useNavigate()
  const { genre, analysisMode, file, sessionId, setReport } = useSessionStore()
  const { user } = useAuthStore()
  const [currentStage, setCurrentStage] = useState(0)
  const [stages, setStages] = useState<ProcessingStage[]>(mockStatusStages.stages)
  const [isComplete, setIsComplete] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentOperation, setCurrentOperation] = useState(mockOperations[0])
  const geminiStarted = useRef(false)
  // Tracks whether Gemini has finished so the stage ticker can stop early
  const geminiComplete = useRef(false)

  const totalStages = stages.length
  const progress = Math.min(100, (currentStage / totalStages) * 100)

  const reportId = sessionId ?? 'demo'

  // ── Helpers ────────────────────────────────────────────────────────────────

  const advanceToStage = useCallback((target: number) => {
    setStages((prev) =>
      prev.map((s, i) =>
        i < target
          ? { ...s, status: 'completed' as const }
          : i === target
          ? { ...s, status: 'active' as const }
          : s
      )
    )
    setCurrentStage(target)
  }, [])

  const completeAllStages = useCallback(() => {
    setStages((prev) => prev.map((s) => ({ ...s, status: 'completed' as const })))
    setCurrentStage(totalStages)
    setCurrentOperation('Analysis complete!')
    setIsComplete(true)
  }, [totalStages])

  // ── Safety timeout ─────────────────────────────────────────────────────────

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isComplete && !error) {
        setIsTimedOut(true)
      }
    }, MAX_PROCESSING_TIME_MS)
    return () => clearTimeout(timeout)
  }, [isComplete, error])

  // ── Gemini AI analysis ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!USE_GEMINI || !file || !genre || !analysisMode || geminiStarted.current) return
    geminiStarted.current = true

    analyzeWithGemini({
      file,
      genre,
      mode: analysisMode,
      // FIX: pass the canonical session ID so the report's sessionId matches the URL param
      sessionId: reportId,
      onStageUpdate: (stage) => {
        setCurrentOperation(stage)
        // Map Gemini's real progress signals to specific stages for a responsive feel
        if (stage === 'Converting audio for analysis...') advanceToStage(1)
        if (stage === 'Sending audio to Gemini AI for analysis...') advanceToStage(3)
        if (stage === 'Processing AI analysis results...') advanceToStage(7)
      },
    })
      .then((report) => {
        geminiComplete.current = true
        setReport(report)

        // FIX: Persist to history so History page shows real analyses, not just mock data
        void saveAnalysisToHistory(report, user?.id)

        // FIX: Persist to sessionStorage so report survives a page refresh
        persistReportForSession(report)

        completeAllStages()
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Gemini analysis failed')
      })
  }, [file, genre, analysisMode, reportId, setReport, advanceToStage, completeAllStages, user?.id])

  // ── Gemini stage ticker ────────────────────────────────────────────────────
  // Slowly advances stages 0–7 while Gemini is working, giving the user visual
  // feedback. Uses staggered delays so it feels organic, not mechanical.
  // Stops as soon as Gemini finishes (completeAllStages jumps to 100%).

  useEffect(() => {
    if (!USE_GEMINI || isComplete || error || isTimedOut) return
    // Don't advance past stage 7 — leave the final deletion stage for real completion
    if (currentStage >= totalStages - 2) return
    if (geminiComplete.current) return

    const delay = GEMINI_STAGE_DELAYS_MS[Math.min(currentStage, GEMINI_STAGE_DELAYS_MS.length - 1)]
    const timer = setTimeout(() => {
      if (geminiComplete.current) return // Gemini finished while timer was pending
      const next = Math.min(currentStage + 1, totalStages - 2)
      advanceToStage(next)
      setCurrentOperation(mockOperations[Math.min(next, mockOperations.length - 1)])
    }, delay)

    return () => clearTimeout(timer)
  }, [USE_GEMINI, currentStage, totalStages, isComplete, error, isTimedOut, advanceToStage])

  // ── Mock stage progression (non-Gemini mode) ───────────────────────────────

  useEffect(() => {
    if (USE_GEMINI || isTimedOut || error) return
    if (currentStage >= totalStages) {
      setIsComplete(true)
      return
    }

    const timer = setTimeout(() => {
      advanceToStage(currentStage + 1)
      setCurrentOperation(mockOperations[Math.min(currentStage + 1, mockOperations.length - 1)])
    }, 1200 + Math.random() * 800)

    return () => clearTimeout(timer)
  }, [currentStage, totalStages, isTimedOut, error, advanceToStage])

  // ── Auto-redirect countdown after completion ───────────────────────────────

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

  // ── Reset / retry ──────────────────────────────────────────────────────────

  const handleRetry = useCallback(() => {
    setIsTimedOut(false)
    setError(null)
    setIsComplete(false)
    setCurrentStage(0)
    setCountdown(3)
    setCurrentOperation(mockOperations[0])
    setStages(mockStatusStages.stages)
    geminiStarted.current = false
    geminiComplete.current = false
  }, [])

  const handleSkipToReport = useCallback(() => {
    navigate(`/app/report/${reportId}`)
  }, [navigate, reportId])

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-2">
          {USE_GEMINI ? 'AI Analyzing Your Track' : 'Processing Your Track'}
        </h1>

        <div className="flex items-center gap-3 mb-8">
          <span className="text-sm text-text-secondary font-body">
            {file?.name ?? 'Midnight Protocol (Final Mix).wav'}
          </span>
          <Badge variant="cyan">{genre ?? 'techno'}</Badge>
          <Badge variant="purple">{analysisMode ?? 'both'}</Badge>
          {USE_GEMINI && <Badge variant="default">Gemini AI</Badge>}
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
              <p className="text-xs text-text-secondary font-mono">{currentOperation}</p>
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
