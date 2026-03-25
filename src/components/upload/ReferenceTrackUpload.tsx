import { useState, useRef } from 'react'
import { ChevronDown, ChevronUp, FileAudio, X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const ACCEPTED_FORMATS = ['.wav', '.aiff', '.flac']

interface ReferenceTrackUploadProps {
  file: File | null
  onFileSelect: (file: File | null) => void
}

export default function ReferenceTrackUpload({ file, onFileSelect }: ReferenceTrackUploadProps) {
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) onFileSelect(selectedFile)
  }

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
        aria-expanded={expanded}
        aria-label="Add reference track"
      >
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-accent-cyan" />
          <span className="font-body text-sm text-text-primary">Add Reference Track for A/B Comparison</span>
          <Badge variant="default" className="text-[10px]">Optional</Badge>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          {file ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary">
              <div className="flex items-center gap-3">
                <FileAudio className="w-4 h-4 text-accent-purple" />
                <span className="text-sm text-text-primary">{file.name}</span>
              </div>
              <button
                onClick={() => onFileSelect(null)}
                className="text-text-muted hover:text-text-primary"
                aria-label="Remove reference track"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => inputRef.current?.click()}
              className={cn(
                'border border-dashed border-border-accent rounded-lg p-6 text-center cursor-pointer',
                'hover:bg-white/[0.02] transition-colors'
              )}
              role="button"
              aria-label="Upload reference track"
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
              <p className="text-xs text-text-muted">
                Click to upload a reference master — WAV, AIFF, FLAC
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
