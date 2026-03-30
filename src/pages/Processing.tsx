import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
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
import { analysisApi } from '@/services/analysisApi'
import type { ProcessingStage } from '@/types/analysis'

const HAS_GEMINI = !!import.meta.env.VITE_GEMINI_API_KEY

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
  const { genre, analysisMode, file, sessionId, setReport } = useSessionStore()
  const userId = useAuthStore((s) => s.user?.id)
  const { user: authUser, setUser: setAuthUser } = useAuthStore()
  const [currentStage, setCurrentStage] = useState(0)
  const [stages, setStages] = useState<ProcessingStage[]>(
    mockStatusStages.stages.map((s, i) => i === 0 ? { ...s, status: 'active' as const } : s)
  )
  const [geminiDone, setGeminiDone] = useState(false)
  const [animationDone, setAnimationDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(3)
  const geminiLaunched = useRef(false)

  const total = stages.length
  const pct = Math.round((currentStage / total) * 100)
  const reportPath = `/app/report/${sessionId ?? 'demo'}`

  // In mock mode (no Gemini), "done" = animation complete
  // In Gemini mode, "done" = BOTH animation complete AND Gemini complete
  const allDone = HAS_GEMINI ? (geminiDone && animationDone) : animationDone

  // Launch Gemini analysis
  useEffect(() => {
    if (!HAS_GEMINI || !file || !genre || !analysisMode || geminiLaunched.current) return
    geminiLaunched.current = true

    analyzeWithGemini({ file, genre, mode: analysisMode })
      .then((report) => {
        report.sessionId = sessionId ?? 'demo'
        console.log('[mixtrue] Gemini complete:', report.trackName)
        setReport(report)
        setGeminiDone(true)
        if (userId) {
          analysisApi.saveReport(report, userId)
          analysisApi.incrementAnalysisCount(userId)
          // Update sidebar count immediately without waiting for Supabase
          if (authUser) {
            setAuthUser({ ...authUser, analyses_this_month: (authUser.analyses_this_month ?? 0) + 1 })
          }
        }
      })
      .catch((err) => {
        console.error('[mixtrue] Gemini failed:', err)
        toast.error(`Analysis error: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setError(err instanceof Error ? err.message : 'Analysis failed')
      })
  }, [file, genre, analysisMode, sessionId, setReport, userId])

  // Stage animation
  useEffect(() => {
    if (animationDone || error) return
    if (currentStage >= total) {
      setAnimationDone(true)
      return
    }
    // Gemini mode: if animation finishes before Gemini, slow down the last few stages
    const isNearEnd = HAS_GEMINI && currentStage >= total - 2 && !geminiDone
    const delay = isNearEnd ? 8000 : (HAS_GEMINI ? 4000 : 1500)

    const id = setTimeout(() => {
      setStages(prev => prev.map((s, i) =>
        i === currentStage ? { ...s, status: 'completed' as const } :
        i === currentStage + 1 ? { ...s, status: 'active' as const } : s
      ))
      setCurrentStage(n => n + 1)
    }, delay)
    return () => clearTimeout(id)
  }, [currentStage, total, animationDone, error, geminiDone])

  // When Gemini finishes and animation is still going, jump to complete
  useEffect(() => {
    if (geminiDone && !animationDone) {
      setStages(prev => prev.map(s => ({ ...s, status: 'completed' as const })))
      setCurrentStage(total)
      setAnimationDone(true)
    }
  }, [geminiDone, animationDone, total])

  // Countdown then navigate - only when ALL done
  useEffect(() => {
    if (!allDone) return
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
  }, [allDone, navigate, reportPath])

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

        {error ? (
          <div className="glass-card p-8 text-center space-y-4">
            <p className="text-accent-red font-display font-semibold">Analysis Failed</p>
            <p className="text-sm text-text-secondary">{error}</p>
            <Button variant="primary" size="md" onClick={goToReport}>View Demo Report</Button>
          </div>
        ) : (
          <>
            <ProcessingPipeline stages={stages} currentStage={currentStage} />

            <div className="mt-8 space-y-3">
              <Progress value={pct} showLabel />
              <p className="text-xs text-text-secondary font-mono">
                {currentStage < total ? operations[currentStage] ?? 'Processing...' :
                  geminiDone ? 'Analysis complete!' : 'Finalizing analysis...'}
              </p>
            </div>

            {!allDone && currentStage >= 2 && (
              <div className="mt-6 text-center">
                <Button variant="muted" size="sm" onClick={goToReport}>
                  Skip to report
                </Button>
              </div>
            )}

            {allDone && (
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
          </>
        )}
      </div>
    </PageTransition>
  )
}
