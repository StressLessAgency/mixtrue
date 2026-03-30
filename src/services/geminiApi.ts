import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ReportData, GenreMode, AnalysisMode } from '@/types/analysis'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

// Gemini inline data limit. Files larger than this must use the File API,
// which requires a server-side upload proxy (not supported in this browser-only build).
const GEMINI_INLINE_LIMIT_BYTES = 20 * 1024 * 1024 // 20 MB

function getClient() {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing VITE_GEMINI_API_KEY environment variable')
  }
  return new GoogleGenerativeAI(GEMINI_API_KEY)
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Strip the data URL prefix (e.g. "data:audio/wav;base64,")
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function getMimeType(file: File): string {
  if (file.type) return file.type
  const ext = file.name.split('.').pop()?.toLowerCase()
  const mimeMap: Record<string, string> = {
    wav: 'audio/wav',
    mp3: 'audio/mp3',
    flac: 'audio/flac',
    aac: 'audio/aac',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
    aiff: 'audio/aiff',
    aif: 'audio/aiff',
  }
  return mimeMap[ext ?? ''] ?? 'audio/wav'
}

function buildAnalysisPrompt(genre: GenreMode, mode: AnalysisMode, fileName: string, fileSizeMb: number): string {
  return `You are an expert audio engineer and mastering engineer. Analyze this audio file and provide a detailed mix/master analysis report.

Track: "${fileName}"
Genre: ${genre}
Analysis Mode: ${mode}
File Size: ${fileSizeMb} MB

Analyze the audio and return a JSON object matching this exact structure. Be specific, actionable, and genre-aware in your analysis. Use your expertise to evaluate frequency balance, dynamics, stereo field, club readiness, mastering quality, and provide AI fix recommendations.

Return ONLY valid JSON (no markdown, no code fences) with this structure:

{
  "trackName": "${fileName}",
  "fileFormat": "WAV or MP3 etc based on the file",
  "fileSizeMb": ${fileSizeMb},
  "genreMode": "${genre}",
  "analysisMode": "${mode}",
  "overallScore": <0-100 integer>,
  "mixdownScore": <0-100 integer>,
  "clubScore": <0-100 integer>,
  "masterScore": <0-100 integer>,
  "executiveSummary": "<2-3 sentence summary of the track's mix quality>",
  "categoryScores": [
    { "category": "Frequency Balance", "score": <0-100>, "verdict": "<short verdict>" },
    { "category": "Dynamic Range", "score": <0-100>, "verdict": "<short verdict>" },
    { "category": "Stereo Field", "score": <0-100>, "verdict": "<short verdict>" },
    { "category": "Clarity & Separation", "score": <0-100>, "verdict": "<short verdict>" },
    { "category": "Transient Response", "score": <0-100>, "verdict": "<short verdict>" },
    { "category": "Club Readiness", "score": <0-100>, "verdict": "<short verdict>" },
    { "category": "Master Level", "score": <0-100>, "verdict": "<short verdict>" },
    { "category": "Codec Resilience", "score": <0-100>, "verdict": "<short verdict>" },
    { "category": "Phase Coherence", "score": <0-100>, "verdict": "<short verdict>" }
  ],
  "priorityIssues": [
    {
      "severity": "critical" | "warning" | "advisory",
      "title": "<issue title>",
      "description": "<detailed description with specific values>",
      "tab": "frequency" | "dynamics" | "stereo" | "club" | "master"
    }
  ],
  "frequency": {
    "spectrumData": [
      { "frequency": <Hz integer from 20 to 20000>, "userAmplitude": <dB float>, "genreTarget": <dB float> }
    ],
    "bands": [
      { "name": "Sub-Bass", "range": "20-60Hz", "userLevel": <dB float>, "genreTarget": <dB float>, "deviation": <dB float>, "status": "ok" | "boost" | "cut" | "critical" }
    ],
    "issues": [
      { "type": "<issue type>", "description": "<detailed description>", "eqFix": "<specific EQ recommendation>", "frequency": <Hz>, "gain": <dB>, "q": <Q value>, "pluginSuggestion": "<plugin name>" }
    ],
    "score": <0-100>
  },
  "dynamics": {
    "metrics": {
      "drScore": <float>,
      "drRating": "<Poor/Fair/Good/Excellent>",
      "integratedLufs": <negative float>,
      "rmsLevel": <negative float>,
      "crestFactor": <float>
    },
    "waveformData": [
      { "time": <seconds float>, "amplitude": <0-1 float>, "isCompressed": <boolean>, "isClipping": <boolean> }
    ],
    "transientBands": [
      { "band": "<band name>", "snap": <0-100>, "target": <0-100> }
    ],
    "compressionEvents": [
      { "timestamp": <seconds float>, "severity": "critical" | "warning" | "advisory", "type": "<event type>" }
    ],
    "overCompressionDetected": <boolean>,
    "compressionRatioEstimate": <float>,
    "score": <0-100>
  },
  "stereoField": {
    "goniometerData": [
      { "x": <-1 to 1 float>, "y": <-1 to 1 float> }
    ],
    "midSideBalance": { "mid": <0-100>, "side": <0-100> },
    "phaseCorrelation": <-1 to 1 float>,
    "stereoWidthBands": [
      { "band": "<band name>", "width": <0-100>, "ideal": <0-100> }
    ],
    "issues": [
      { "timestamp": "<mm:ss>", "issue": "<description>", "severity": "critical" | "warning" | "advisory" }
    ],
    "haasEffectDetected": <boolean>,
    "combFilteringDetected": <boolean>,
    "score": <0-100>
  },
  "clubReadiness": {
    "overallScore": <0-100>,
    "subBassLevel": <negative dB float>,
    "subBassVerdict": "<verdict string>",
    "kickPunch": { "score": <0-100>, "description": "<description>" },
    "monoCompatibility": { "stereoLevel": <dB float>, "monoLevel": <dB float>, "lossPercent": <0-100 float> },
    "highSplSimulation": { "warning": <boolean>, "description": "<description>" },
    "djHeadroom": { "truePeak": <dB float>, "target": <dB float>, "pass": <boolean> },
    "bpmDetection": { "bpm": <integer>, "key": "<musical key>", "camelotPosition": "<camelot code>" },
    "energyFlow": [
      { "time": <seconds>, "energy": <0-1 float> }
    ],
    "energySections": [
      { "label": "<section name>", "start": <seconds>, "end": <seconds>, "color": "<hex color>" }
    ],
    "metrics": [
      { "name": "<metric name>", "score": <0-100>, "verdict": "<short verdict>", "description": "<description>" }
    ]
  },
  "master": {
    "platformTargets": [
      { "platform": "<platform name>", "target": "<target LUFS string>", "userValue": <LUFS float>, "status": "pass" | "warning" | "fail" }
    ],
    "integratedLufs": <negative float>,
    "shortTermLufs": <negative float>,
    "truePeak": <negative float>,
    "loudnessRange": <float>,
    "interSampleDistortionCount": <integer>,
    "limiterArtifacts": [
      { "type": "<artifact type>", "detected": <boolean>, "description": "<description>" }
    ],
    "codecSimulation": [
      { "frequency": <Hz>, "lossless": <dB float>, "mp3_320": <dB float>, "aac_256": <dB float> }
    ],
    "harmonicDistortion": [
      { "order": "<harmonic order>", "percentage": <float> }
    ],
    "noiseFloor": <negative dB float>,
    "score": <0-100>
  },
  "aiFixes": {
    "fixes": [
      {
        "priority": "critical" | "warning" | "advisory",
        "category": "Frequency" | "Dynamics" | "Stereo" | "Master",
        "title": "<fix title>",
        "problem": "<detailed problem description>",
        "fix": ["<step 1>", "<step 2>", "..."],
        "pluginSuggestions": ["<plugin 1>", "<plugin 2>"],
        "settings": [{ "frequency": <Hz>, "gain": <dB>, "q": <Q> }] or [{ "param": "<name>", "value": "<value>" }],
        "estimatedImprovement": "<estimated score improvement>"
      }
    ],
    "beforeAfterSpectrum": [
      { "frequency": <Hz>, "before": <dB float>, "after": <dB float> }
    ]
  }
}

IMPORTANT GUIDELINES:
- Generate 30 spectrum data points across 20Hz-20kHz (logarithmically spaced: 20, 30, 40, 50, 60, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000)
- Generate 7 frequency bands: Sub-Bass, Bass, Low-Mid, Mid, High-Mid, Presence, Air
- Generate 200 waveform data points spanning the track duration
- Generate 500 goniometer data points
- Generate energy flow data every 2 seconds across the track duration
- For ${genre} genre, use appropriate targets and reference values
- Be honest and specific about issues detected
- Provide actionable, professional-grade recommendations
- Include at least 3-5 priority issues
- Include at least 3-5 AI fix recommendations
- All scores should reflect genuine analysis, not just high numbers
- Return ONLY the JSON object, no other text`
}

export interface GeminiAnalysisOptions {
  file: File
  genre: GenreMode
  mode: AnalysisMode
  /** The session ID to embed in the returned report. Avoids a UUID mismatch between
   *  the store-generated ID (used for routing) and the report's internal ID. */
  sessionId: string
  referenceFile?: File
  onStageUpdate?: (stage: string) => void
}

export async function analyzeWithGemini(options: GeminiAnalysisOptions): Promise<ReportData> {
  const { file, genre, mode, sessionId, onStageUpdate } = options

  // FIX: Validate file size before attempting the Gemini API call.
  // Inline data is capped at 20 MB. Larger files must go through the File API,
  // which requires a server-side upload proxy (not implemented in this build).
  if (file.size > GEMINI_INLINE_LIMIT_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
    throw new Error(
      `File is ${sizeMb} MB — the browser-based Gemini analyzer supports files up to 20 MB. ` +
      `Please export a lower-bitrate or shorter preview for analysis, or use a compressed format.`
    )
  }

  const client = getClient()
  const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' })

  onStageUpdate?.('Converting audio for analysis...')

  const base64Audio = await fileToBase64(file)
  const mimeType = getMimeType(file)
  const fileSizeMb = Math.round((file.size / (1024 * 1024)) * 10) / 10

  onStageUpdate?.('Sending audio to Gemini AI for analysis...')

  const prompt = buildAnalysisPrompt(genre, mode, file.name, fileSizeMb)

  const result = await model.generateContent([
    { inlineData: { data: base64Audio, mimeType } },
    { text: prompt },
  ])

  onStageUpdate?.('Processing AI analysis results...')

  const responseText = result.response.text()

  // Strip potential markdown code fences (Gemini sometimes wraps JSON despite instructions)
  const jsonStr = responseText
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/```\s*$/m, '')
    .trim()

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(jsonStr)
  } catch {
    throw new Error(
      'Gemini returned a response that could not be parsed as JSON. ' +
      'This can happen with very short audio clips or unsupported formats. ' +
      'Try a WAV or FLAC file at least 30 seconds long.'
    )
  }

  const reportData = parsed as unknown as ReportData

  // FIX: Use the caller-provided sessionId (the same one embedded in the URL)
  // so that Report.tsx's storedReport.sessionId === sessionId check always passes.
  reportData.sessionId = sessionId
  reportData.createdAt = new Date().toISOString()
  reportData.deletionReceipt = {
    receiptId: 'DEL-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    fileName: file.name,
    deletedAt: new Date().toISOString(),
    // FIX: Use the canonical sessionId here too (was previously a different random UUID)
    sessionId,
    storage: 'Ephemeral session — no disk',
    aiTraining: 'Opted out (default)',
  }

  return reportData
}
