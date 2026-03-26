import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, ArrowRight, FileAudio, Check, Star, Headphones, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageTransition from '@/components/layout/PageTransition'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'

const testimonials = [
  {
    quote: "Finally a tool that tells me exactly what's wrong with my mix and how to fix it. The EQ suggestions alone saved me hours.",
    name: 'DJ Kira',
    role: 'Techno Producer',
    rating: 5,
  },
  {
    quote: "The club readiness score changed how I approach mastering. I know exactly how my track will translate before I leave the studio.",
    name: 'Marcus Bell',
    role: 'House DJ / Producer',
    rating: 5,
  },
  {
    quote: "Love that my files are never stored. As a label owner, privacy matters. The analysis quality is on par with expensive mastering engineers.",
    name: 'Sarah Chen',
    role: 'Label A&R',
    rating: 5,
  },
]

const comparisonItems = [
  { feature: 'Full spectrum analysis (20Hz–20kHz)', mixtrue: true, others: 'partial' },
  { feature: 'Genre-calibrated benchmarks', mixtrue: true, others: false },
  { feature: 'Club readiness simulation', mixtrue: true, others: false },
  { feature: 'AI-powered fix recommendations', mixtrue: true, others: false },
  { feature: 'Codec resilience testing', mixtrue: true, others: 'partial' },
  { feature: 'Zero file retention', mixtrue: true, others: false },
  { feature: 'Stereo phase analysis', mixtrue: true, others: true },
  { feature: 'DJ playability scoring', mixtrue: true, others: false },
]

export default function Landing() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-bg-primary">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-bg-primary/80 backdrop-blur-xl border-b border-border-subtle">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-accent-cyan" />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">
              mixtrue<span className="text-accent-cyan text-glow-cyan ml-0.5">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <Link to="/pricing" className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors uppercase tracking-wider">
              Pricing
            </Link>
            <Link to="/login" className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors uppercase tracking-wider">
              Log In
            </Link>
            <Link
              to="/signup"
              className="text-xs font-mono font-medium px-4 py-2 rounded-lg bg-accent-cyan text-bg-primary hover:bg-accent-cyan/90 transition-colors shadow-[0_0_20px_rgba(0,229,255,0.2)]"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />

        {/* Social Proof / Testimonials */}
        <section className="py-28 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-purple/[0.02] to-transparent" />
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-mono text-accent-purple uppercase tracking-widest mb-3 block">Testimonials</span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-4">
                Trusted by producers worldwide
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card p-6 flex flex-col gap-4"
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }, (_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-accent-amber text-accent-amber" />
                    ))}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed flex-1">"{t.quote}"</p>
                  <div>
                    <p className="text-sm font-display font-semibold text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-28 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-mono text-accent-green uppercase tracking-widest mb-3 block">Why mixtrue</span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-4">
                More than a loudness meter
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                Most analysis tools give you numbers. We give you actionable intelligence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="daw-panel overflow-hidden"
            >
              <div className="grid grid-cols-[1fr_100px_100px] text-xs font-mono">
                <div className="px-4 py-3 text-text-muted uppercase tracking-wider border-b border-border-subtle">Feature</div>
                <div className="px-4 py-3 text-accent-cyan text-center border-b border-border-subtle">mixtrue</div>
                <div className="px-4 py-3 text-text-muted text-center border-b border-border-subtle">Others</div>
                {comparisonItems.map((item) => (
                  <div key={item.feature} className="contents">
                    <div className="px-4 py-3 text-text-secondary text-sm font-body border-b border-border-subtle">{item.feature}</div>
                    <div className="px-4 py-3 text-center border-b border-border-subtle">
                      {item.mixtrue && <Check className="w-4 h-4 text-accent-green mx-auto" />}
                    </div>
                    <div className="px-4 py-3 text-center border-b border-border-subtle">
                      {item.others === true ? (
                        <Check className="w-4 h-4 text-text-muted mx-auto" />
                      ) : item.others === 'partial' ? (
                        <span className="text-text-muted text-xs">~</span>
                      ) : (
                        <span className="text-text-muted text-xs">--</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-28 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-pink/[0.02] to-transparent" />
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-mono text-accent-pink uppercase tracking-widest mb-3 block">Built For</span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary">
                Every stage of your workflow
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: Headphones,
                  title: 'Producers',
                  description: 'Get instant feedback on your mixdowns. Identify mud, harshness, and phase issues before you even bounce for mastering.',
                  color: '#00E5FF',
                },
                {
                  icon: Zap,
                  title: 'Mastering Engineers',
                  description: 'Validate your masters against platform targets. Check codec resilience, true peak, and loudness range in one click.',
                  color: '#7C3AED',
                },
                {
                  icon: Shield,
                  title: 'Labels & A&R',
                  description: 'Quality-check submissions at scale. Get objective scores without needing to listen to every track end-to-end.',
                  color: '#FF2D78',
                },
              ].map((useCase, i) => {
                const Icon = useCase.icon
                return (
                  <motion.div
                    key={useCase.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="glass-card p-6 text-center"
                  >
                    <div
                      className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center"
                      style={{
                        backgroundColor: `${useCase.color}08`,
                        border: `1px solid ${useCase.color}20`,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: useCase.color }} />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-text-primary mb-2">{useCase.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{useCase.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-28 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-mono text-accent-amber uppercase tracking-widest mb-3 block">Pricing</span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-4">
                Start free. Scale when ready.
              </h2>
              <p className="text-text-secondary mb-10">
                No credit card required. Upgrade anytime.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-left"
              >
                <h3 className="font-display font-semibold text-lg text-text-primary mb-1">Free</h3>
                <p className="text-3xl font-display font-bold text-text-primary mb-4">$0<span className="text-sm font-normal text-text-muted">/mo</span></p>
                <ul className="space-y-2 text-sm text-text-secondary mb-6">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-accent-green" /> 3 analyses per month</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-accent-green" /> Mixdown analysis</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-accent-green" /> Frequency + dynamics</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-text-muted" /> Watermarked PDF</li>
                </ul>
                <Link to="/signup">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 text-left border-accent-cyan/30 relative shadow-[0_0_40px_rgba(0,229,255,0.05)]"
              >
                <span className="absolute -top-3 left-4 px-3 py-0.5 text-[10px] font-mono bg-accent-cyan text-bg-primary rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
                <h3 className="font-display font-semibold text-lg text-text-primary mb-1">Pro</h3>
                <p className="text-3xl font-display font-bold text-text-primary mb-4">$19<span className="text-sm font-normal text-text-muted">/mo</span></p>
                <ul className="space-y-2 text-sm text-text-secondary mb-6">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-accent-cyan" /> Unlimited analyses</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-accent-cyan" /> Full analysis suite</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-accent-cyan" /> Reference track A/B</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-accent-cyan" /> Clean PDF export</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-accent-cyan" /> Version history</li>
                </ul>
                <Link to="/signup">
                  <Button variant="primary" className="w-full shadow-[0_0_20px_rgba(0,229,255,0.15)]">
                    Start Pro Trial
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
            <Link
              to="/pricing"
              className="inline-block mt-8 text-xs font-mono text-accent-cyan hover:underline uppercase tracking-wider"
            >
              View full pricing details &rarr;
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-28 px-6 relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-60" />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-6">
                Ready to hear the <span className="text-accent-cyan text-glow-cyan">truth</span>?
              </h2>
              <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
                Upload your track and get a professional mix analysis in under 30 seconds. No account required for your first analysis.
              </p>
              <Link to="/signup">
                <Button size="xl" variant="primary" className="shadow-[0_0_40px_rgba(0,229,255,0.25)]">
                  <FileAudio className="w-5 h-5" />
                  Analyze Your First Track Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border-subtle py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-accent-cyan" />
                  </div>
                  <span className="font-display font-bold text-sm text-text-primary">
                    mixtrue<span className="text-accent-cyan ml-0.5">AI</span>
                  </span>
                </div>
                <p className="text-xs text-text-muted max-w-xs">
                  AI-powered audio mix and master analysis for producers, engineers, and labels.
                </p>
              </div>
              <div className="flex gap-12">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Product</h4>
                  <div className="flex flex-col gap-1.5">
                    <Link to="/pricing" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Pricing</Link>
                    <Link to="/app/report/demo" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Sample Report</Link>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Account</h4>
                  <div className="flex flex-col gap-1.5">
                    <Link to="/login" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Login</Link>
                    <Link to="/signup" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Sign Up</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-border-subtle pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[10px] text-text-muted font-mono">
                Privacy by design — your audio is never stored or used for training.
              </p>
              <p className="text-[10px] text-text-muted font-mono">
                &copy; {new Date().getFullYear()} mixtrue AI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}
