import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageTransition from '@/components/layout/PageTransition'
import GenreSelector from '@/components/upload/GenreSelector'
import AnalysisModeSelector from '@/components/upload/AnalysisModeSelector'
import FileDropZone from '@/components/upload/FileDropZone'
import ReferenceTrackUpload from '@/components/upload/ReferenceTrackUpload'
import { useSessionStore } from '@/stores/useSessionStore'
import type { GenreMode, AnalysisMode } from '@/types/analysis'

const STEPS = ['Genre', 'Mode', 'Upload', 'Reference', 'Launch']

export default function Upload() {
  const navigate = useNavigate()
  const { setGenre, setAnalysisMode, setFile, setReferenceFile, setSessionId } = useSessionStore()
  const [step, setStep] = useState(0)
  const [genre, setLocalGenre] = useState<GenreMode | null>(null)
  const [mode, setLocalMode] = useState<AnalysisMode | null>(null)
  const [file, setLocalFile] = useState<File | null>(null)
  const [refFile, setLocalRefFile] = useState<File | null>(null)

  const canProceed = () => {
    switch (step) {
      case 0: return !!genre
      case 1: return !!mode
      case 2: return !!file
      case 3: return true
      case 4: return !!genre && !!mode && !!file
      default: return false
    }
  }

  const handleLaunch = () => {
    if (!genre || !mode || !file) return
    setGenre(genre)
    setAnalysisMode(mode)
    setFile(file)
    setReferenceFile(refFile)
    setSessionId(crypto.randomUUID())
    useSessionStore.setState({ isRealUpload: true })
    navigate('/app/processing')
  }

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-text-primary mb-2">Analyze Your Track</h1>
        <p className="text-text-secondary text-sm mb-8">Follow the steps below to start your analysis.</p>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => i <= step && setStep(i)}
                className={`w-8 h-8 rounded-full text-xs font-mono flex items-center justify-center transition-all cursor-pointer ${
                  i === step
                    ? 'bg-accent-cyan text-bg-primary glow-cyan'
                    : i < step
                    ? 'bg-accent-green/20 text-accent-green'
                    : 'bg-bg-tertiary text-text-muted'
                }`}
                aria-label={`Step ${i + 1}: ${label}`}
              >
                {i < step ? '\u2713' : i + 1}
              </button>
              <span className={`text-xs font-body hidden md:block ${
                i === step ? 'text-text-primary' : 'text-text-muted'
              }`}>
                {label}
              </span>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-border-subtle" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-8">
          {step === 0 && <GenreSelector selected={genre} onSelect={setLocalGenre} />}
          {step === 1 && <AnalysisModeSelector selected={mode} onSelect={setLocalMode} />}
          {step === 2 && <FileDropZone file={file} onFileSelect={setLocalFile} />}
          {step === 3 && <ReferenceTrackUpload file={refFile} onFileSelect={setLocalRefFile} />}
          {step === 4 && (
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Ready to Analyze</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Genre Mode</span>
                    <span className="text-text-primary font-mono capitalize">{genre?.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Analysis Mode</span>
                    <span className="text-text-primary font-mono capitalize">{mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Track</span>
                    <span className="text-text-primary font-mono truncate max-w-[200px]">{file?.name}</span>
                  </div>
                  {refFile && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Reference</span>
                      <span className="text-text-primary font-mono truncate max-w-[200px]">{refFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button size="xl" className="w-full" onClick={handleLaunch}>
                Analyze Track
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="muted"
            size="md"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          {step < 4 && (
            <Button
              size="md"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
