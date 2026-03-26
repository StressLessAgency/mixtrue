import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, FileAudio, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AnimatedWaveform from './AnimatedWaveform'

const genreBadges = [
  { label: 'Techno', color: '#00E5FF' },
  { label: 'House', color: '#7C3AED' },
  { label: 'Drum & Bass', color: '#00FF9D' },
  { label: 'Hip-Hop', color: '#FFB800' },
  { label: 'Pop', color: '#FF2D78' },
  { label: 'Rock', color: '#FF3B5C' },
  { label: 'Ambient', color: '#00E5FF' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const stats = [
  { value: '30+', label: 'Analysis Metrics' },
  { value: '7', label: 'Frequency Bands' },
  { value: '<30s', label: 'Analysis Time' },
  { value: '0', label: 'Files Retained' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 grid-pattern" />

      {/* Neon orbs */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,229,255,0.1) 0%, rgba(124,58,237,0.06) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono border border-accent-cyan/20 bg-accent-cyan/5 text-accent-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_6px_rgba(0,229,255,0.6)]" />
            Professional Audio Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-bold text-5xl md:text-7xl text-text-primary leading-tight mb-6"
        >
          Your mix.
          <br />
          <span className="text-accent-cyan text-glow-cyan">Analyzed. Perfected.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="font-body text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10"
        >
          Upload your track and get a professional-grade mix analysis in seconds.
          Frequency balance, dynamics, stereo field, club readiness, mastering — all in one report.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center mb-12">
          <Link to="/signup">
            <Button size="xl" variant="primary" className="shadow-[0_0_30px_rgba(0,229,255,0.2)]">
              <FileAudio className="w-5 h-5" />
              Start Analyzing Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/app/report/demo">
            <Button size="xl" variant="ghost">
              <Play className="w-4 h-4" />
              See Sample Report
            </Button>
          </Link>
        </motion.div>

        {/* Animated Waveform */}
        <motion.div variants={itemVariants} className="mb-10">
          <AnimatedWaveform />
        </motion.div>

        {/* Genre Badges */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-2 justify-center mb-16">
          {genreBadges.map((badge, i) => (
            <motion.span
              key={badge.label}
              className="px-3 py-1 rounded-full text-[10px] font-mono border uppercase tracking-wider"
              style={{
                color: badge.color,
                borderColor: `${badge.color}30`,
                backgroundColor: `${badge.color}08`,
              }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
            >
              {badge.label}
            </motion.span>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="daw-panel px-4 py-4 text-center">
              <p className="font-mono font-bold text-2xl text-accent-cyan text-glow-cyan">{stat.value}</p>
              <p className="text-xs text-text-muted font-mono uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
