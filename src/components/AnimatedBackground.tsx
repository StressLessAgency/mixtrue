export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Cyan orb — top left, drifts right-down */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full animate-[drift1_25s_ease-in-out_infinite]"
        style={{
          top: '-10%',
          left: '-5%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)',
          filter: 'blur(120px)',
          willChange: 'transform',
        }}
      />

      {/* Purple orb — center right, drifts left-up */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full animate-[drift2_30s_ease-in-out_infinite]"
        style={{
          top: '30%',
          right: '-8%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
          filter: 'blur(120px)',
          willChange: 'transform',
        }}
      />

      {/* Pink orb — bottom left, drifts up-right */}
      <div
        className="absolute w-[450px] h-[450px] rounded-full animate-[drift3_22s_ease-in-out_infinite]"
        style={{
          bottom: '-5%',
          left: '20%',
          background: 'radial-gradient(circle, rgba(255,45,120,0.06) 0%, transparent 70%)',
          filter: 'blur(120px)',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
