import { motion } from 'framer-motion'
import { AudioWaveform, Speaker, ShieldCheck, Zap, BarChart3, Disc3 } from 'lucide-react'

const features = [
  {
    icon: AudioWaveform,
    title: 'Spectrum Analysis',
    description: 'Full 20Hz–20kHz frequency breakdown with genre-calibrated benchmarks, EQ fix suggestions, and mud/harshness detection.',
    color: '#00E5FF',
  },
  {
    icon: Zap,
    title: 'Dynamic Range & Transients',
    description: 'DR score, LUFS metering, crest factor, compression detection, and transient snap analysis across all frequency bands.',
    color: '#FFB800',
  },
  {
    icon: Speaker,
    title: 'Club Readiness',
    description: 'Sub-bass evaluation, mono compatibility, 106dB SPL simulation, DJ headroom check, BPM/key detection.',
    color: '#FF2D78',
  },
  {
    icon: BarChart3,
    title: 'Master Analysis',
    description: 'Platform loudness targets (Spotify, Apple, Beatport), true peak, codec resilience, limiter artifacts, inter-sample distortion.',
    color: '#7C3AED',
  },
  {
    icon: Disc3,
    title: 'Stereo Field',
    description: 'Goniometer visualization, mid/side balance, phase correlation, per-band stereo width, Haas effect and comb filtering detection.',
    color: '#00FF9D',
  },
  {
    icon: ShieldCheck,
    title: 'Zero Retention Privacy',
    description: 'Audio encrypted in transit, analyzed in ephemeral sessions, deleted instantly. Never stored. Never trained on. Deletion receipt provided.',
    color: '#00E5FF',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-28 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-cyan/[0.02] to-transparent" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-accent-cyan uppercase tracking-widest mb-3 block">Analysis Engine</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-4">
            Six dimensions of audio intelligence
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Every track is analyzed across frequency, dynamics, stereo, club readiness, mastering, and privacy — with studio-grade precision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card glass-card-hover p-6 flex flex-col gap-3 group"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${feature.color}10`,
                    border: `1px solid ${feature.color}20`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <h3 className="font-display font-semibold text-base text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
