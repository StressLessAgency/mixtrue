import { motion } from 'framer-motion'

const BAR_COUNT = 64

export default function AnimatedWaveform() {
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => ({
    id: i,
    height: 20 + Math.random() * 80,
    delay: Math.random() * 1.5,
    duration: 1.5 + Math.random() * 1.5,
  }))

  return (
    <div className="flex items-center justify-center gap-[2px] h-32 overflow-hidden">
      {bars.map((bar) => (
        <motion.div
          key={bar.id}
          initial={{ height: 4, opacity: 0 }}
          animate={{
            height: [bar.height * 0.3, bar.height, bar.height * 0.5, bar.height * 0.8, bar.height * 0.3],
            opacity: [0.4, 0.9, 0.6, 0.8, 0.4],
          }}
          transition={{
            height: {
              duration: bar.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: bar.delay,
            },
            opacity: {
              duration: bar.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: bar.delay,
            },
          }}
          className="w-[3px] rounded-full bg-gradient-to-t from-accent-cyan/30 to-accent-cyan"
          style={{
            filter: 'drop-shadow(0 0 4px rgba(0,229,255,0.3))',
          }}
        />
      ))}
    </div>
  )
}
