import { Link } from 'react-router-dom'
import { Check, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageTransition from '@/components/layout/PageTransition'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    features: [
      '3 analyses per month',
      'Mixdown analysis only',
      'Basic frequency + dynamics report',
      'PDF export (watermarked)',
    ],
    cta: 'Get Started Free',
    ctaLink: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo or $149/yr',
    features: [
      'Unlimited analyses',
      'Full Mixdown + Master + Club Readiness',
      'Reference track A/B comparison',
      'Version history (unlimited revisions)',
      'Clean PDF export',
      'Priority processing',
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '/signup',
    highlighted: true,
  },
]

export default function Pricing() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-bg-primary">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent-cyan" />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">
              mixtrue
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Log In</Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-20">
          <h1 className="font-display font-bold text-4xl text-text-primary text-center mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-text-secondary text-center mb-16 max-w-lg mx-auto">
            Start analyzing for free. Upgrade to Pro for the full professional toolkit.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`glass-card p-8 relative ${
                  plan.highlighted ? 'border-accent-cyan/30 glow-cyan' : ''
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-6 px-3 py-1 text-xs font-mono bg-accent-cyan text-bg-primary rounded-full font-medium">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display font-semibold text-xl text-text-primary mb-2">
                  {plan.name}
                </h3>
                <p className="mb-6">
                  <span className="text-4xl font-display font-bold text-text-primary">{plan.price}</span>
                  <span className="text-sm text-text-muted ml-1">{plan.period}</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={plan.ctaLink}>
                  <Button
                    className="w-full"
                    size="lg"
                    variant={plan.highlighted ? 'primary' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
