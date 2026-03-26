import { motion } from 'framer-motion'

const BAR_COUNT = 96

export default function AnimatedWaveform() {
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
    const center = BAR_COUNT / 2
    const dist = Math.abs(i - center) / center
    const maxHeight = 100 * (1 - dist * 0.6)
    return {
      id: i,
      height: 15 + Math.random() * maxHeight,
      delay: Math.random() * 2,
      duration: 1.8 + Math.random() * 1.8,
    }
  })

  return (
    <div className="flex items-center justify-center gap-[1.5px] h-40 overflow-hidden">
      {bars.map((bar) => (
        <motion.div
          key={bar.id}
          initial={{ height: 4, opacity: 0 }}
          animate={{
            height: [bar.height * 0.2, bar.height, bar.height * 0.4, bar.height * 0.9, bar.height * 0.2],
            opacity: [0.3, 0.95, 0.5, 0.85, 0.3],
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
          className="w-[2.5px] rounded-full"
          style={{
            background: `linear-gradient(to top, rgba(0,229,255,0.15), rgba(0,229,255,0.7), rgba(124,58,237,0.9))`,
            filter: 'drop-shadow(0 0 3px rgba(0,229,255,0.4)) drop-shadow(0 0 8px rgba(124,58,237,0.2))',
          }}
        />
      ))}
    </div>
  )
}
