import { Link } from 'react-router-dom'
import { BarChart3 } from 'lucide-react'
import PageTransition from '@/components/layout/PageTransition'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'

export default function Landing() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-bg-primary">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent-cyan" />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">
              mixtrue
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors font-body">
              Pricing
            </Link>
            <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors font-body">
              Log In
            </Link>
            <Link
              to="/signup"
              className="text-sm font-body font-medium px-4 py-2 rounded-lg bg-accent-cyan text-bg-primary hover:bg-accent-cyan/90 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />

        {/* Pricing Preview */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display font-bold text-3xl text-text-primary mb-4">
              Simple Pricing
            </h2>
            <p className="text-text-secondary mb-10">
              Start free. Upgrade when you need the full toolkit.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="glass-card p-6 text-left">
                <h3 className="font-display font-semibold text-lg text-text-primary mb-1">Free</h3>
                <p className="text-2xl font-display font-bold text-text-primary mb-4">$0<span className="text-sm font-normal text-text-muted">/mo</span></p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>3 analyses per month</li>
                  <li>Mixdown analysis only</li>
                  <li>Basic frequency + dynamics</li>
                </ul>
              </div>
              <div className="glass-card p-6 text-left border-accent-cyan/30 relative">
                <span className="absolute -top-3 left-4 px-2 py-0.5 text-xs font-mono bg-accent-cyan text-bg-primary rounded-full">
                  Most Popular
                </span>
                <h3 className="font-display font-semibold text-lg text-text-primary mb-1">Pro</h3>
                <p className="text-2xl font-display font-bold text-text-primary mb-4">$19<span className="text-sm font-normal text-text-muted">/mo</span></p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>Unlimited analyses</li>
                  <li>Full analysis suite</li>
                  <li>Reference track A/B</li>
                </ul>
              </div>
            </div>
            <Link
              to="/pricing"
              className="inline-block mt-8 text-sm text-accent-cyan hover:underline font-body"
            >
              View full pricing details &rarr;
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border-subtle py-12 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent-cyan/20 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-accent-cyan" />
              </div>
              <span className="font-display font-bold text-sm text-text-primary">
                mixtrue
              </span>
            </div>
            <div className="flex gap-6 text-xs text-text-muted font-body">
              <Link to="/pricing" className="hover:text-text-secondary transition-colors">Pricing</Link>
              <Link to="/login" className="hover:text-text-secondary transition-colors">Login</Link>
              <Link to="/signup" className="hover:text-text-secondary transition-colors">Sign Up</Link>
            </div>
            <p className="text-xs text-text-muted font-body">
              Privacy by design — your audio is never stored.
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}
