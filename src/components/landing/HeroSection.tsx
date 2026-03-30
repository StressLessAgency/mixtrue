import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, FileAudio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AnimatedWaveform from './AnimatedWaveform'

const genreBadges = [
  { label: 'Techno', color: '#00E5FF' },
  { label: 'House', color: '#7C3AED' },
  { label: 'Hip-Hop', color: '#FFB800' },
  { label: 'Pop', color: '#FF2D78' },
  { label: 'Rock', color: '#FF3B5C' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 grid-pattern" />

      {/* Neon orb glow — inspired by reference image */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,229,255,0.12) 0%, rgba(124,58,237,0.08) 40%, rgba(255,45,120,0.05) 70%, transparent 100%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-bold text-5xl md:text-7xl text-text-primary leading-tight mb-6"
        >
          Your Mix. Analyzed.{' '}
          <span className="text-accent-cyan text-glow-cyan">Perfected.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="font-body text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10"
        >
          Frequency, dynamic, and master analysis built for producers
          and DJs who demand precision.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center mb-16">
          <Link to="/app/upload">
            <Button size="xl" variant="primary">
              <FileAudio className="w-5 h-5" />
              Analyze Your Track Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/app/report/demo">
            <Button size="xl" variant="ghost">
              See Sample Report
            </Button>
          </Link>
        </motion.div>

        {/* Animated Waveform */}
        <motion.div variants={itemVariants}>
          <AnimatedWaveform />
        </motion.div>

        {/* Floating Genre Badges */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-3 justify-center mt-8"
        >
          {genreBadges.map((badge, i) => (
            <motion.span
              key={badge.label}
              className="px-4 py-1.5 rounded-full text-xs font-mono border"
              style={{
                color: badge.color,
                borderColor: `${badge.color}40`,
                backgroundColor: `${badge.color}10`,
              }}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            >
              {badge.label}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
