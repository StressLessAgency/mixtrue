import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Globe } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PageTransition from '@/components/layout/PageTransition'
import { useAuthStore } from '@/stores/useAuthStore'

export default function Signup() {
  const navigate = useNavigate()
  const { signUpWithEmail, signInWithGoogle } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return
    setLoading(true)
    try {
      await signUpWithEmail(email, password, name)
      toast.success('Account created! Check your email to confirm.')
      navigate('/login')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Google sign in failed')
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen auth-ambient flex items-center justify-center px-6">
        <div className="glass-card p-8 w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
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
                required
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
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                aria-label="Password"
                minLength={6}
                required
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
            <Button type="submit" className="w-full" size="lg" disabled={!agreed || loading}>
              {loading ? 'Creating account...' : 'Create Account'}
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

          <Button variant="outline" className="w-full" size="lg" onClick={handleGoogle}>
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
