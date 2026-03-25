import { motion } from 'framer-motion'
import { AudioWaveform, Speaker, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: AudioWaveform,
    title: 'Deep Frequency Analysis',
    description: 'Full spectrum analysis from 20Hz to 20kHz with genre-calibrated benchmarks, band-by-band breakdown, and EQ fix recommendations.',
  },
  {
    icon: Speaker,
    title: 'Club Readiness Score',
    description: 'Test how your track performs on club systems — sub-bass, mono compatibility, DJ headroom, BPM/key detection, and high-SPL simulation.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy First — Zero Retention',
    description: 'Your audio is encrypted in transit, analyzed in an ephemeral session, and permanently deleted. Never stored. Never trained on.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, i) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="glass-card glass-card-hover p-8 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-accent-cyan" />
              </div>
              <h3 className="font-display font-semibold text-lg text-text-primary">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
