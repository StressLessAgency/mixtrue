export type GenreMode =
  | 'techno' | 'house' | 'drum-and-bass' | 'hip-hop' | 'trap'
  | 'pop' | 'rnb' | 'rock' | 'ambient' | 'custom'

export type AnalysisMode = 'mixdown' | 'master' | 'both'

export type SeverityLevel = 'critical' | 'warning' | 'advisory'

export type BandStatus = 'ok' | 'boost' | 'cut' | 'critical'

export interface AnalysisPayload {
  file: File
  genre: GenreMode
  mode: AnalysisMode
  referenceFile?: File
}

export interface SessionResponse {
  sessionId: string
  estimatedSeconds: number
}

export interface ProcessingStage {
  id: number
  label: string
  status: 'pending' | 'active' | 'completed'
  description?: string
}

export interface StatusResponse {
  stage: number
  progress: number
  currentOperation: string
  stages: ProcessingStage[]
}

export interface DeletionReceipt {
  receiptId: string
  fileName: string
  deletedAt: string
  sessionId: string
  storage: string
  aiTraining: string
}

export interface FrequencyBand {
  name: string
  range: string
  userLevel: number
  genreTarget: number
  deviation: number
  status: BandStatus
}

export interface FrequencyIssue {
  type: string
  description: string
  eqFix: string
  frequency: number
  gain: number
  q: number
  pluginSuggestion: string
}

export interface SpectrumDataPoint {
  frequency: number
  userAmplitude: number
  referenceAmplitude?: number
  genreTarget: number
}

export interface FrequencyAnalysis {
  spectrumData: SpectrumDataPoint[]
  bands: FrequencyBand[]
  issues: FrequencyIssue[]
  score: number
}

export interface DynamicsMetrics {
  drScore: number
  drRating: string
  integratedLufs: number
  rmsLevel: number
  crestFactor: number
}

export interface CompressionEvent {
  timestamp: number
  severity: SeverityLevel
  type: string
}

export interface TransientBand {
  band: string
  snap: number
  target: number
}

export interface DynamicsAnalysis {
  metrics: DynamicsMetrics
  waveformData: { time: number; amplitude: number; isCompressed: boolean; isClipping: boolean }[]
  transientBands: TransientBand[]
  compressionEvents: CompressionEvent[]
  overCompressionDetected: boolean
  compressionRatioEstimate: number
  score: number
}

export interface StereoIssue {
  timestamp: string
  issue: string
  severity: SeverityLevel
}

export interface StereoWidthBand {
  band: string
  width: number
  ideal: number
}

export interface GoniometerPoint {
  x: number
  y: number
}

export interface StereoFieldAnalysis {
  goniometerData: GoniometerPoint[]
  midSideBalance: { mid: number; side: number }
  phaseCorrelation: number
  stereoWidthBands: StereoWidthBand[]
  issues: StereoIssue[]
  haasEffectDetected: boolean
  combFilteringDetected: boolean
  score: number
}

export interface ClubMetric {
  name: string
  score: number
  verdict: string
  description: string
}

export interface EnergySection {
  label: string
  start: number
  end: number
  color: string
}

export interface EnergyDataPoint {
  time: number
  energy: number
}

export interface ClubReadinessAnalysis {
  overallScore: number
  subBassLevel: number
  subBassVerdict: string
  kickPunch: { score: number; description: string }
  monoCompatibility: { stereoLevel: number; monoLevel: number; lossPercent: number }
  highSplSimulation: { warning: boolean; description: string }
  djHeadroom: { truePeak: number; target: number; pass: boolean }
  bpmDetection: { bpm: number; key: string; camelotPosition: string }
  energyFlow: EnergyDataPoint[]
  energySections: EnergySection[]
  metrics: ClubMetric[]
}

export interface PlatformLufs {
  platform: string
  target: string
  userValue: number
  status: 'pass' | 'warning' | 'fail'
}

export interface LimiterArtifact {
  type: string
  detected: boolean
  description: string
}

export interface CodecSimulationPoint {
  frequency: number
  lossless: number
  mp3_320: number
  aac_256: number
}

export interface HarmonicDistortion {
  order: string
  percentage: number
}

export interface MasterAnalysis {
  platformTargets: PlatformLufs[]
  integratedLufs: number
  shortTermLufs: number
  truePeak: number
  loudnessRange: number
  interSampleDistortionCount: number
  limiterArtifacts: LimiterArtifact[]
  codecSimulation: CodecSimulationPoint[]
  harmonicDistortion: HarmonicDistortion[]
  noiseFloor: number
  score: number
}

export interface FixCard {
  priority: SeverityLevel
  category: string
  title: string
  problem: string
  fix: string[]
  pluginSuggestions: string[]
  settings: { frequency?: number; gain?: number; q?: number; param?: string; value?: string }[]
  estimatedImprovement: string
}

export interface AIFixesAnalysis {
  fixes: FixCard[]
  beforeAfterSpectrum: { frequency: number; before: number; after: number }[]
}

export interface PriorityIssue {
  severity: SeverityLevel
  title: string
  description: string
  tab: string
}

export interface ReportData {
  sessionId: string
  trackName: string
  fileFormat: string
  fileSizeMb: number
  genreMode: GenreMode
  analysisMode: AnalysisMode
  createdAt: string
  overallScore: number
  mixdownScore: number
  clubScore: number
  masterScore: number
  categoryScores: { category: string; score: number; verdict: string }[]
  priorityIssues: PriorityIssue[]
  frequency: FrequencyAnalysis
  dynamics: DynamicsAnalysis
  stereoField: StereoFieldAnalysis
  clubReadiness: ClubReadinessAnalysis
  master: MasterAnalysis
  aiFixes: AIFixesAnalysis
  deletionReceipt: DeletionReceipt
}
