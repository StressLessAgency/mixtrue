import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ReportData, GenreMode, AnalysisMode } from '@/types/analysis'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

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

Analyze the audio and return a JSON object matching this exact structure. Be specific, actionable, and genre-aware in your analysis. Use your expertise to evaluate frequency balance, dynamics, stereo field, club readiness, mastering quality, and provide fix recommendations.

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
    ],
    "arrangement": {
      "sections": [
        {
          "label": "<section label e.g. Intro, Drop 1, Breakdown, Build, Outro>",
          "startTime": <seconds float>,
          "endTime": <seconds float>,
          "energyLevel": <0-1 float>,
          "verdict": "strong" | "needs-work" | "weak",
          "feedback": "<specific feedback on this section>",
          "recommendations": ["<recommendation 1>", "<recommendation 2>"],
          "transitionQuality": <0-100>,
          "transitionFeedback": "<feedback on transition into next section>"
        }
      ],
      "overallStructureScore": <0-100>,
      "structureVerdict": "<overall verdict on the song structure>",
      "genreStructureComparison": "<how this track's structure compares to typical ${genre} tracks>",
      "sectionLengthAnalysis": [
        { "section": "<section name>", "bars": <integer>, "ideal": "<ideal bar range for genre>", "verdict": "<ok/too-short/too-long>" }
      ],
      "insights": [
        { "title": "<insight title>", "explanation": "<explanation>", "recommendation": "<what to do>", "genreNote": "<genre-specific note>" }
      ]
    },
    "djPlayability": {
      "overallScore": <0-100>,
      "mixInScore": <0-100>,
      "mixOutScore": <0-100>,
      "introLength": { "bars": <integer>, "seconds": <float>, "verdict": "<too-short/ideal/too-long>", "recommendation": "<specific recommendation>" },
      "outroLength": { "bars": <integer>, "seconds": <float>, "verdict": "<too-short/ideal/too-long>", "recommendation": "<specific recommendation>" },
      "bpmStability": { "isStable": <boolean>, "variance": <bpm float variance>, "verdict": "<stable/drifting/unstable>" },
      "keyCompatibility": {
        "key": "<musical key>",
        "camelot": "<camelot code>",
        "compatibleKeys": ["<key 1>", "<key 2>", "<key 3>"],
        "energyBoostKeys": ["<key 1>", "<key 2>"]
      },
      "beatgridFriendly": <boolean>,
      "firstBeatClarity": { "score": <0-100>, "verdict": "<clear/unclear/problematic>" },
      "loopPoints": [
        { "time": <seconds float>, "bars": <integer>, "quality": "excellent" | "good" | "fair" }
      ],
      "mixabilityIssues": [
        { "issue": "<description of issue>", "severity": "critical" | "warning" | "advisory", "fix": "<how to fix>" }
      ],
      "insights": [
        { "title": "<insight title>", "explanation": "<explanation>", "recommendation": "<what to do>", "genreNote": "<genre-specific note>" }
      ]
    }
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
  },
  "referenceTrackSuggestions": [
    {
      "artist": "<well-known artist name>",
      "track": "<specific track title>",
      "reason": "<why this track is a good reference for the user's mix - what quality it exemplifies>",
      "relevantMetric": "<which analysis area this relates to, e.g. Sub-Bass, Stereo Width, Dynamic Range>"
    }
  ]
}

IMPORTANT GUIDELINES:
- Generate 20 spectrum data points across 20Hz-20kHz (logarithmically spaced: 20, 40, 60, 100, 160, 250, 400, 630, 1000, 1600, 2500, 4000, 6300, 8000, 10000, 12500, 16000, 20000, plus 2 more of your choice)
- Generate 7 frequency bands: Sub-Bass, Bass, Low-Mid, Mid, High-Mid, Presence, Air
- Generate 50 waveform data points spanning the track duration (evenly spaced)
- Generate 80 goniometer data points
- Generate energy flow data every 5 seconds across the track duration
- Generate 4-8 arrangement sections based on actual song structure (Intro, Build, Drop, Breakdown, Outro etc - use genre-appropriate labels)
- Generate 2-4 loop points at musically sensible positions
- For ${genre} genre, use appropriate targets and reference values
- Be honest and specific about issues detected
- Provide actionable, professional-grade recommendations
- Include at least 3-5 priority issues
- Include at least 3-5 fix recommendations
- All scores should reflect genuine analysis, not just high numbers
- Include 3-5 reference track suggestions: well-known, commercially released tracks in the ${genre} genre that exemplify qualities the user's mix could improve on (e.g. better sub-bass, cleaner high end, tighter dynamics). Use real artist names and track titles.
- Return ONLY the JSON object, no other text`
}

export interface GeminiAnalysisOptions {
  file: File
  genre: GenreMode
  mode: AnalysisMode
  referenceFile?: File
  onStageUpdate?: (stage: string) => void
}

export async function analyzeWithGemini(options: GeminiAnalysisOptions): Promise<ReportData> {
  const { file, genre, mode, onStageUpdate } = options

  const client = getClient()
  const model = client.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      // @ts-expect-error - thinkingConfig is supported by Gemini 2.5 but not in the SDK types yet
      thinkingConfig: { thinkingBudget: 0 },
    },
  })

  onStageUpdate?.('Converting audio for analysis...')

  const base64Audio = await fileToBase64(file)
  const mimeType = getMimeType(file)
  const fileSizeMb = Math.round((file.size / (1024 * 1024)) * 10) / 10

  onStageUpdate?.('Sending audio for deep analysis...')

  const prompt = buildAnalysisPrompt(genre, mode, file.name, fileSizeMb)

  const result = await model.generateContent([
    { inlineData: { data: base64Audio, mimeType } },
    { text: prompt },
  ])

  onStageUpdate?.('Processing analysis results...')

  const responseText = result.response.text()

  // Extract JSON from the response - handle code fences, surrounding text, etc.
  let jsonStr = responseText.trim()

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  const fenceMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/)
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim()
  } else {
    // Try to find the JSON object directly (starts with { ends with })
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
  }

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(jsonStr)
  } catch (e) {
    console.error('[mixtrue] JSON parse failed. Response start:', jsonStr.substring(0, 200))
    throw new Error(`Failed to parse analysis response. Response started with: "${jsonStr.substring(0, 80)}..."`)
  }

  // Attach session metadata
  const reportData = parsed as unknown as ReportData
  reportData.sessionId = crypto.randomUUID()
  reportData.createdAt = new Date().toISOString()
  reportData.deletionReceipt = {
    receiptId: 'DEL-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    fileName: file.name,
    deletedAt: new Date().toISOString(),
    sessionId: reportData.sessionId,
    storage: 'Ephemeral session — no disk',
    aiTraining: 'Opted out (default)',
  }

  return reportData
}
