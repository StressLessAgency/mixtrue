import type {
  ReportData,
  StatusResponse,
  DeletionReceipt,
  SpectrumDataPoint,
  FrequencyBand,
  FrequencyIssue,
  GoniometerPoint,
  EnergyDataPoint,
  EnergySection,
  CodecSimulationPoint,
} from '@/types/analysis'

function generateSpectrumData(): SpectrumDataPoint[] {
  const frequencies = [20, 30, 40, 50, 60, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000]
  return frequencies.map((freq) => {
    const base = -20 - Math.log10(freq / 1000) * 5
    return {
      frequency: freq,
      userAmplitude: base + (Math.random() - 0.5) * 12,
      referenceAmplitude: base + (Math.random() - 0.5) * 4,
      genreTarget: base + (Math.random() - 0.5) * 2,
    }
  })
}

function generateFrequencyBands(): FrequencyBand[] {
  return [
    { name: 'Sub-Bass', range: '20–60Hz', userLevel: -18.2, genreTarget: -16.0, deviation: -2.2, status: 'boost' },
    { name: 'Bass', range: '60–250Hz', userLevel: -12.4, genreTarget: -12.0, deviation: -0.4, status: 'ok' },
    { name: 'Low-Mid', range: '250–500Hz', userLevel: -8.1, genreTarget: -10.5, deviation: 2.4, status: 'cut' },
    { name: 'Mid', range: '500Hz–2kHz', userLevel: -14.2, genreTarget: -14.0, deviation: -0.2, status: 'ok' },
    { name: 'High-Mid', range: '2–8kHz', userLevel: -16.8, genreTarget: -18.0, deviation: 1.2, status: 'ok' },
    { name: 'Presence', range: '8–12kHz', userLevel: -22.5, genreTarget: -20.0, deviation: -2.5, status: 'boost' },
    { name: 'Air', range: '12–20kHz', userLevel: -30.1, genreTarget: -28.0, deviation: -2.1, status: 'boost' },
  ]
}

function generateFrequencyIssues(): FrequencyIssue[] {
  return [
    {
      type: 'Mud Detected',
      description: 'Excessive energy buildup between 250–400Hz is causing a muddy, undefined low-mid range that masks clarity in your bass and vocal elements.',
      eqFix: 'Cut –4dB at 320Hz | Q: 2.1 | Plugin suggestion: FabFilter Pro-Q 3',
      frequency: 320,
      gain: -4,
      q: 2.1,
      pluginSuggestion: 'FabFilter Pro-Q 3',
    },
    {
      type: 'Harshness',
      description: 'A narrow peak around 3.2kHz is causing ear fatigue. This is common in synth-heavy mixes where multiple elements compete in the presence range.',
      eqFix: 'Cut –2.5dB at 3.2kHz | Q: 3.0 | Plugin suggestion: Waves SSL E-Channel',
      frequency: 3200,
      gain: -2.5,
      q: 3.0,
      pluginSuggestion: 'Waves SSL E-Channel',
    },
    {
      type: 'Thinness in Air Band',
      description: 'The air frequencies (12–20kHz) are lacking energy compared to genre targets, resulting in a closed, dark tonality.',
      eqFix: 'Shelf boost +2dB at 14kHz | Q: 0.7 | Plugin suggestion: Maag EQ4',
      frequency: 14000,
      gain: 2,
      q: 0.7,
      pluginSuggestion: 'Maag EQ4',
    },
  ]
}

function generateWaveformData() {
  const data = []
  for (let i = 0; i < 200; i++) {
    const time = i * 0.5
    const amplitude = 0.3 + Math.random() * 0.5 + Math.sin(i * 0.1) * 0.15
    data.push({
      time,
      amplitude: Math.min(amplitude, 1),
      isCompressed: amplitude > 0.85 && Math.random() > 0.5,
      isClipping: amplitude > 0.95 && Math.random() > 0.7,
    })
  }
  return data
}

function generateGoniometerData(): GoniometerPoint[] {
  const points: GoniometerPoint[] = []
  for (let i = 0; i < 500; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 0.7 + 0.1
    points.push({
      x: Math.cos(angle) * radius * (0.6 + Math.random() * 0.4),
      y: Math.sin(angle) * radius,
    })
  }
  return points
}

function generateEnergyFlow(): { data: EnergyDataPoint[]; sections: EnergySection[] } {
  const data: EnergyDataPoint[] = []
  const totalTime = 240
  for (let t = 0; t <= totalTime; t += 2) {
    let energy = 0.3
    if (t < 30) energy = 0.2 + (t / 30) * 0.3
    else if (t < 60) energy = 0.5 + ((t - 30) / 30) * 0.4
    else if (t < 90) energy = 0.9 + Math.sin((t - 60) * 0.2) * 0.1
    else if (t < 120) energy = 0.4 + Math.sin((t - 90) * 0.1) * 0.15
    else if (t < 180) energy = 0.85 + Math.sin((t - 120) * 0.15) * 0.1
    else energy = 0.6 - ((t - 180) / 60) * 0.4
    data.push({ time: t, energy: energy + (Math.random() - 0.5) * 0.05 })
  }

  const sections: EnergySection[] = [
    { label: 'INTRO', start: 0, end: 30, color: '#7C3AED' },
    { label: 'BUILD', start: 30, end: 60, color: '#FFB800' },
    { label: 'DROP', start: 60, end: 90, color: '#FF2D78' },
    { label: 'BREAKDOWN', start: 90, end: 120, color: '#00E5FF' },
    { label: 'DROP 2', start: 120, end: 180, color: '#FF2D78' },
    { label: 'OUTRO', start: 180, end: 240, color: '#7C3AED' },
  ]

  return { data, sections }
}

function generateCodecSimulation(): CodecSimulationPoint[] {
  const frequencies = [20, 50, 100, 200, 500, 1000, 2000, 5000, 8000, 10000, 12000, 14000, 16000, 18000, 20000]
  return frequencies.map((freq) => {
    const base = -10 - Math.log10(freq / 500) * 3
    return {
      frequency: freq,
      lossless: base,
      mp3_320: freq > 16000 ? base - 15 - Math.random() * 10 : base - Math.random() * 2,
      aac_256: freq > 17000 ? base - 20 - Math.random() * 8 : base - Math.random() * 1.5,
    }
  })
}

const { data: energyData, sections: energySections } = generateEnergyFlow()

export const mockReport: ReportData = {
  sessionId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  trackName: 'Midnight Protocol (Final Mix)',
  fileFormat: 'WAV',
  fileSizeMb: 48.3,
  genreMode: 'techno',
  analysisMode: 'both',
  createdAt: new Date().toISOString(),
  overallScore: 72,
  mixdownScore: 68,
  clubScore: 81,
  masterScore: 74,
  categoryScores: [
    { category: 'Frequency Balance', score: 64, verdict: 'Low-mid buildup reducing clarity' },
    { category: 'Dynamic Range', score: 71, verdict: 'Slightly over-compressed for genre' },
    { category: 'Stereo Field', score: 78, verdict: 'Good width, minor phase issues' },
    { category: 'Clarity & Separation', score: 62, verdict: 'Masking detected in mid range' },
    { category: 'Transient Response', score: 75, verdict: 'Punchy kicks, soft hi-hats' },
    { category: 'Club Readiness', score: 81, verdict: 'Club-ready with minor fixes' },
    { category: 'Master Level', score: 74, verdict: 'Within targets for most platforms' },
    { category: 'Codec Resilience', score: 83, verdict: 'Minimal degradation at 320kbps' },
    { category: 'Phase Coherence', score: 77, verdict: 'Good mono compatibility' },
  ],
  priorityIssues: [
    { severity: 'critical', title: 'Low-Mid Mud (250–400Hz)', description: 'Excessive buildup causing loss of definition. Cut 3–4dB around 320Hz.', tab: 'frequency' },
    { severity: 'warning', title: 'Over-Compression on Master Bus', description: 'Dynamic range is 5.2 dB — below genre target of 7+. Reduce master limiter gain.', tab: 'dynamics' },
    { severity: 'warning', title: 'Phase Issue at 0:42', description: 'Brief phase cancellation detected in the stereo field during the breakdown.', tab: 'stereo' },
    { severity: 'advisory', title: 'Air Band Lacking Energy', description: 'Presence above 12kHz is 2dB below target. Consider a gentle shelf boost.', tab: 'frequency' },
    { severity: 'advisory', title: 'True Peak Above –1dBTP', description: 'True peak at –0.3dBTP may cause inter-sample distortion on some playback systems.', tab: 'master' },
  ],
  frequency: {
    spectrumData: generateSpectrumData(),
    bands: generateFrequencyBands(),
    issues: generateFrequencyIssues(),
    score: 64,
  },
  dynamics: {
    metrics: {
      drScore: 5.2,
      drRating: 'Fair',
      integratedLufs: -7.8,
      rmsLevel: -10.2,
      crestFactor: 8.4,
    },
    waveformData: generateWaveformData(),
    transientBands: [
      { band: 'Sub-Bass', snap: 62, target: 55 },
      { band: 'Bass', snap: 78, target: 70 },
      { band: 'Low-Mid', snap: 55, target: 60 },
      { band: 'Mid', snap: 68, target: 65 },
      { band: 'High-Mid', snap: 82, target: 80 },
      { band: 'High', snap: 45, target: 75 },
    ],
    compressionEvents: [
      { timestamp: 32.5, severity: 'warning', type: 'Sustained compression' },
      { timestamp: 67.2, severity: 'critical', type: 'Limiter clamp' },
      { timestamp: 124.8, severity: 'warning', type: 'Sustained compression' },
    ],
    overCompressionDetected: true,
    compressionRatioEstimate: 6.2,
    score: 71,
  },
  stereoField: {
    goniometerData: generateGoniometerData(),
    midSideBalance: { mid: 62, side: 38 },
    phaseCorrelation: 0.72,
    stereoWidthBands: [
      { band: 'Sub-Bass', width: 15, ideal: 10 },
      { band: 'Bass', width: 25, ideal: 20 },
      { band: 'Low-Mid', width: 40, ideal: 35 },
      { band: 'Mid', width: 55, ideal: 50 },
      { band: 'High-Mid', width: 70, ideal: 65 },
      { band: 'Presence', width: 80, ideal: 75 },
      { band: 'Air', width: 85, ideal: 80 },
    ],
    issues: [
      { timestamp: '0:42', issue: 'Phase cancellation detected', severity: 'warning' },
      { timestamp: '1:18', issue: 'Excessive stereo width in bass', severity: 'advisory' },
      { timestamp: '2:55', issue: 'Mono collapse in mid-range', severity: 'warning' },
    ],
    haasEffectDetected: false,
    combFilteringDetected: true,
    score: 78,
  },
  clubReadiness: {
    overallScore: 81,
    subBassLevel: -14.2,
    subBassVerdict: 'Within club system sweet spot — good sub-bass energy in the 40–60Hz range.',
    kickPunch: { score: 85, description: 'Strong transient snap on kick. Good attack definition for club playback.' },
    monoCompatibility: { stereoLevel: -7.8, monoLevel: -9.1, lossPercent: 8 },
    highSplSimulation: { warning: false, description: 'Track performs well at high SPL. No problematic resonances detected.' },
    djHeadroom: { truePeak: -0.3, target: -6, pass: false },
    bpmDetection: { bpm: 132, key: 'A Minor', camelotPosition: '8A' },
    energyFlow: energyData,
    energySections: energySections,
    metrics: [
      { name: 'Sub-Bass Sweet Spot', score: 82, verdict: 'Good', description: 'Sub-bass energy well-placed for club systems' },
      { name: 'Kick Punch', score: 85, verdict: 'Strong', description: 'Excellent transient definition' },
      { name: 'Mono Compatibility', score: 77, verdict: 'Good', description: '8% loss when summed to mono' },
      { name: 'High-SPL Response', score: 88, verdict: 'Excellent', description: 'Clean at high volumes' },
      { name: 'DJ Headroom', score: 45, verdict: 'Needs Fix', description: 'True peak too close to 0dBFS' },
      { name: 'BPM & Key', score: 100, verdict: '132 BPM / Am', description: 'Camelot: 8A' },
    ],
  },
  master: {
    platformTargets: [
      { platform: 'Spotify', target: '–14 LUFS', userValue: -7.8, status: 'warning' },
      { platform: 'Apple Music', target: '–16 LUFS', userValue: -7.8, status: 'fail' },
      { platform: 'Beatport/Club', target: '–6 to –8 LUFS', userValue: -7.8, status: 'pass' },
    ],
    integratedLufs: -7.8,
    shortTermLufs: -6.4,
    truePeak: -0.3,
    loudnessRange: 4.2,
    interSampleDistortionCount: 3,
    limiterArtifacts: [
      { type: 'Clipping', detected: false, description: 'No digital clipping detected.' },
      { type: 'Pumping', detected: true, description: 'Subtle pumping detected on the master bus during heavy transients.' },
      { type: 'Transient Smearing', detected: false, description: 'Transients are well-preserved through the limiter.' },
    ],
    codecSimulation: generateCodecSimulation(),
    harmonicDistortion: [
      { order: '2nd', percentage: 0.8 },
      { order: '3rd', percentage: 1.2 },
      { order: '4th', percentage: 0.3 },
      { order: '5th+', percentage: 0.1 },
    ],
    noiseFloor: -72.4,
    score: 74,
  },
  aiFixes: {
    fixes: [
      {
        priority: 'critical',
        category: 'Frequency',
        title: 'Reduce Mud in the Low-Mids',
        problem: 'Excessive energy between 250–400Hz is masking bass definition and vocal clarity. This is the single biggest issue affecting your mix quality.',
        fix: [
          'Open an EQ on your mix bus or master',
          'Create a bell cut at 320Hz',
          'Set gain to –4dB with Q of 2.1',
          'Sweep slowly between 250–400Hz to find the worst resonance',
          'Adjust Q narrower if the problem is localized',
        ],
        pluginSuggestions: ['FabFilter Pro-Q 3', 'Waves SSL E-Channel', 'iZotope Neutron EQ'],
        settings: [{ frequency: 320, gain: -4, q: 2.1 }],
        estimatedImprovement: '+12 points to Frequency Score (estimated)',
      },
      {
        priority: 'warning',
        category: 'Dynamics',
        title: 'Reduce Master Bus Compression',
        problem: 'Your dynamic range of 5.2dB is below the genre target of 7+. The master limiter is clamping too aggressively, reducing punch and energy.',
        fix: [
          'Reduce the input gain to your master limiter by 2–3dB',
          'Set a slower release time (100–150ms) to preserve transients',
          'Consider using parallel compression instead of heavy limiting',
          'Target –8 LUFS integrated for club-focused tracks',
        ],
        pluginSuggestions: ['FabFilter Pro-L 2', 'iZotope Ozone Maximizer', 'Waves L2'],
        settings: [{ param: 'Input Gain', value: '–2 to –3dB' }, { param: 'Release', value: '100–150ms' }],
        estimatedImprovement: '+8 points to Dynamics Score (estimated)',
      },
      {
        priority: 'warning',
        category: 'Stereo',
        title: 'Fix Phase Cancellation at 0:42',
        problem: 'A stereo element is causing phase cancellation during the breakdown, resulting in volume drops when summed to mono.',
        fix: [
          'Solo the breakdown section and check in mono',
          'Identify the element causing the issue (likely a pad or reverb)',
          'Apply a mid/side EQ to reduce side content below 200Hz',
          'Add a subtle stereo width reduction during the breakdown',
        ],
        pluginSuggestions: ['iZotope Insight 2', 'Voxengo SPAN', 'Waves Center'],
        settings: [],
        estimatedImprovement: '+5 points to Stereo Score (estimated)',
      },
      {
        priority: 'advisory',
        category: 'Frequency',
        title: 'Boost Air Frequencies',
        problem: 'The air band (12–20kHz) is 2dB below genre target, making the mix sound darker and less open than typical techno releases.',
        fix: [
          'Add a high-shelf EQ starting at 12kHz',
          'Boost gently by +2dB',
          'Use a broad Q setting (0.7)',
          'Compare with your reference track to match brightness',
        ],
        pluginSuggestions: ['Maag EQ4', 'FabFilter Pro-Q 3', 'Waves Vitamin'],
        settings: [{ frequency: 14000, gain: 2, q: 0.7 }],
        estimatedImprovement: '+4 points to Frequency Score (estimated)',
      },
      {
        priority: 'advisory',
        category: 'Master',
        title: 'Lower True Peak Level',
        problem: 'Your true peak is at –0.3dBTP, which is above the recommended –1dBTP ceiling. This can cause inter-sample distortion on some playback systems and lossy codecs.',
        fix: [
          'Enable true peak limiting on your master limiter',
          'Set the ceiling to –1.0dBTP',
          'This will slightly reduce perceived loudness but improve compatibility',
        ],
        pluginSuggestions: ['FabFilter Pro-L 2', 'iZotope Ozone Maximizer'],
        settings: [{ param: 'Ceiling', value: '–1.0 dBTP' }],
        estimatedImprovement: '+6 points to Master Score (estimated)',
      },
    ],
    beforeAfterSpectrum: generateSpectrumData().map((p) => ({
      frequency: p.frequency,
      before: p.userAmplitude,
      after: p.genreTarget + (Math.random() - 0.5) * 2,
    })),
  },
  deletionReceipt: {
    receiptId: 'DEL-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    fileName: 'Midnight Protocol (Final Mix).wav',
    deletedAt: new Date().toISOString(),
    sessionId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    storage: 'Ephemeral session — no disk',
    aiTraining: 'Opted out (default)',
  },
}

export const mockStatusStages: StatusResponse = {
  stage: 0,
  progress: 0,
  currentOperation: 'Initializing...',
  stages: [
    { id: 1, label: 'Encrypting & Uploading', status: 'pending' },
    { id: 2, label: 'Initializing Ephemeral Session', status: 'pending' },
    { id: 3, label: 'Frequency Analysis', status: 'pending' },
    { id: 4, label: 'Dynamic Range Analysis', status: 'pending' },
    { id: 5, label: 'Stereo Field Analysis', status: 'pending' },
    { id: 6, label: 'Club Readiness Analysis', status: 'pending' },
    { id: 7, label: 'Master Analysis', status: 'pending' },
    { id: 8, label: 'Generating AI Report', status: 'pending' },
    { id: 9, label: 'Secure File Deletion', status: 'pending' },
  ],
}

export const mockDeletionReceipt: DeletionReceipt = mockReport.deletionReceipt

export const mockHistorySessions = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    trackName: 'Midnight Protocol (Final Mix)',
    version: 'V3',
    date: '2026-03-25',
    genreMode: 'techno' as const,
    analysisMode: 'both' as const,
    mixdownScore: 68,
    clubScore: 81,
    masterScore: 74,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    trackName: 'Midnight Protocol (Rev 2)',
    version: 'V2',
    date: '2026-03-22',
    genreMode: 'techno' as const,
    analysisMode: 'both' as const,
    mixdownScore: 55,
    clubScore: 72,
    masterScore: 61,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    trackName: 'Midnight Protocol (First Draft)',
    version: 'V1',
    date: '2026-03-18',
    genreMode: 'techno' as const,
    analysisMode: 'mixdown' as const,
    mixdownScore: 42,
    clubScore: 58,
    masterScore: 48,
  },
]
