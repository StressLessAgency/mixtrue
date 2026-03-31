import logoSplash from '@/assets/logo.svg'

interface LoadingScreenProps {
  message?: string
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div style={{ background: '#060609', position: 'relative', minHeight: '100vh' }}>
      {/* Grain */}
      <div className="splash-grain" />

      {/* Orbs */}
      <div className="splash-bg-orb splash-bg-orb--1" />
      <div className="splash-bg-orb splash-bg-orb--2" />

      {/* Scene */}
      <div className="splash-scene">
        <div className="splash-logo-stack">
          <img className="splash-logo-glow" src={logoSplash} alt="" aria-hidden="true" />
          <img className="splash-logo-shadow" src={logoSplash} alt="" aria-hidden="true" />
          <img className="splash-logo-main" src={logoSplash} alt="mixtrue" />
          <img className="splash-logo-shimmer" src={logoSplash} alt="" aria-hidden="true" />
        </div>

        <div className="splash-bar-container">
          <div className="splash-bar-track">
            <div className="splash-bar-fill" />
          </div>
          <div className="splash-status">
            <div className="splash-status-dot" />
            <div className="splash-status-dot" />
            <div className="splash-status-dot" />
          </div>
          {message && <p className="splash-msg">{message}</p>}
        </div>
      </div>
    </div>
  )
}
