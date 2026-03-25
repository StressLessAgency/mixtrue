import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BarChart3, Mail, Lock, User, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PageTransition from '@/components/layout/PageTransition'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return
    navigate('/app/upload')
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
        <div className="glass-card p-8 w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent-cyan" />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">
              mixtrue<span className="text-accent-cyan"> AI</span>
            </span>
          </div>

          <h1 className="font-display font-bold text-2xl text-text-primary mb-1 text-center">Create account</h1>
          <p className="text-text-secondary text-sm text-center mb-8">Start analyzing your mixes</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                aria-label="Full name"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                aria-label="Email address"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                aria-label="Password"
              />
            </div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 accent-accent-cyan"
                aria-label="Agree to terms"
              />
              <span className="text-xs text-text-secondary">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>
            <Button type="submit" className="w-full" size="lg" disabled={!agreed}>
              Create Account
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-bg-secondary text-xs text-text-muted">or</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" size="lg" onClick={() => navigate('/app/upload')}>
            <Globe className="w-4 h-4" />
            Continue with Google
          </Button>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-cyan hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  )
}
