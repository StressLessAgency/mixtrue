import { motion } from 'framer-motion'
import { Upload, Cpu, FileBarChart } from 'lucide-react'

const steps = [
  { number: '01', icon: Upload, title: 'Upload your track', description: 'Drag & drop your WAV, AIFF, or FLAC file. Up to 32-bit / 96kHz supported.' },
  { number: '02', icon: Cpu, title: 'We analyze every layer', description: 'Frequency, dynamics, stereo field, club readiness, and master — all analyzed in seconds.' },
  { number: '03', icon: FileBarChart, title: 'Get your report', description: 'Detailed scores, fix recommendations, and a downloadable PDF. Your file is deleted instantly.' },
]

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-bold text-3xl text-text-primary text-center mb-16"
        >
          How It Works
        </motion.h2>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-12 bottom-12 w-px border-l border-dashed border-border-accent hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  className="flex gap-6 items-start"
                >
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl bg-bg-secondary border border-border-accent flex items-center justify-center">
                    <span className="font-mono font-bold text-xl text-accent-cyan text-glow-cyan">
                      {step.number}
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-accent-cyan" />
                      <h3 className="font-display font-semibold text-lg text-text-primary">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
