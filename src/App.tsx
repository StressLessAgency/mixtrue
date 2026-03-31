import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import AnimatedBackground from './components/AnimatedBackground'
import { useAuthStore } from './stores/useAuthStore'

// Auto-retry on chunk load failure (happens after new deployments when browser has stale cache)
function lazyRetry(fn: () => Promise<{ default: React.ComponentType }>) {
  return lazy(() => fn().catch(() => {
    window.location.reload()
    return fn()
  }))
}

const Landing = lazyRetry(() => import('./pages/Landing'))
const Login = lazyRetry(() => import('./pages/Login'))
const Signup = lazyRetry(() => import('./pages/Signup'))
const Pricing = lazyRetry(() => import('./pages/Pricing'))
const Upload = lazyRetry(() => import('./pages/Upload'))
const Processing = lazyRetry(() => import('./pages/Processing'))
const Report = lazyRetry(() => import('./pages/Report'))
const History = lazyRetry(() => import('./pages/History'))
const Admin = lazyRetry(() => import('./pages/Admin'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
        <span className="text-text-secondary font-body text-sm">Loading...</span>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuthStore()

  if (isLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/app/upload" replace />
  return <>{children}</>
}

export default function App() {
  const location = useLocation()
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div className="grain-overlay w-full overflow-x-hidden">
      <AnimatedBackground />
      <Suspense fallback={<PageLoader />}>
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route path="upload" element={<Upload />} />
            <Route path="processing" element={<Processing />} />
            <Route path="report/:sessionId" element={<Report />} />
            <Route path="history" element={<History />} />
          </Route>
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        </Routes>
      </Suspense>
    </div>
  )
}
