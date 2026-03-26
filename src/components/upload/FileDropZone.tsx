import { useState, useCallback, useRef } from 'react'
import { Upload, FileAudio, Shield, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const ACCEPTED_FORMATS = ['.wav', '.aiff', '.flac']
const ACCEPTED_TYPES = ['audio/wav', 'audio/x-wav', 'audio/aiff', 'audio/x-aiff', 'audio/flac']

interface FileDropZoneProps {
  file: File | null
  onFileSelect: (file: File | null) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFormatBadge(name: string): string {
  const ext = name.split('.').pop()?.toUpperCase() ?? ''
  return ext
}

export default function FileDropZone({ file, onFileSelect }: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && isValidFile(droppedFile)) {
      onFileSelect(droppedFile)
    }
  }, [onFileSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && isValidFile(selectedFile)) {
      onFileSelect(selectedFile)
    }
  }, [onFileSelect])

  function isValidFile(f: File): boolean {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase()
    return ACCEPTED_FORMATS.includes(ext) || ACCEPTED_TYPES.includes(f.type)
  }

  if (file) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
              <FileAudio className="w-6 h-6 text-accent-cyan" />
            </div>
            <div>
              <p className="font-body text-sm text-text-primary font-medium">{file.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="cyan">{getFormatBadge(file.name)}</Badge>
                <span className="text-xs text-text-muted font-mono">{formatFileSize(file.size)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onFileSelect(null)}
            className="p-2 rounded-lg hover:bg-white/[0.05] text-text-muted hover:text-text-primary transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-accent-green/5 border border-accent-green/20">
          <Shield className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary">
            Your file is encrypted in transit, analyzed in a temporary session, and permanently deleted after analysis. Never stored. Never trained on.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="font-display font-semibold text-lg text-text-primary mb-2">Upload Your Track</h3>
      <p className="text-sm text-text-secondary mb-4">Supports up to 32-bit / 96kHz</p>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all',
          isDragOver
            ? 'border-accent-cyan bg-accent-cyan/5 shadow-[0_0_40px_rgba(0,229,255,0.12)] scale-[1.01]'
            : 'border-border-accent dropzone-pulse hover:bg-white/[0.02] hover:border-accent-cyan/30'
        )}
        role="button"
        aria-label="Upload audio file"
        tabIndex={0}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FORMATS.join(',')}
          onChange={handleFileInput}
          className="hidden"
          aria-hidden="true"
        />
        <Upload className={cn('w-10 h-10 mx-auto mb-4', isDragOver ? 'text-accent-cyan' : 'text-text-muted')} />
        <p className="font-body text-sm text-text-primary mb-1">
          Drag & drop your audio file here
        </p>
        <p className="text-xs text-text-muted">
          or click to browse — WAV, AIFF, FLAC
        </p>
      </div>
    </div>
  )
}
