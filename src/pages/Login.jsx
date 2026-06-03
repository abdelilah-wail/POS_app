import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Lock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import { Button, Input, useToast } from '../components/ui'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const { login } = useAuth()
  const t = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const next = {}
    if (!username.trim()) next.username = 'Username is required'
    if (!password) next.password = 'Password is required'
    if (Object.keys(next).length) { setErrors(next); return }

    setSubmitting(true)
    // tiny delay so the loading state feels premium
    await new Promise((r) => setTimeout(r, 600))

    const result = login({ username, password, remember })
    setSubmitting(false)

    if (!result.ok) {
      t.error(result.error)
      setErrors({ password: ' ' })
      return
    }

    t.success(`Welcome back, Omar 👋`)
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full bg-secondary/20 blur-3xl" />

      {/* Left — Hero */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 xl:p-16">
        <motion.div
          initial={ { opacity: 0, y: 16 } }
          animate={ { opacity: 1, y: 0 } }
          transition={ { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Luxury POS · Premium Edition
          </div>
          <h1 className="mt-6 text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05]">
            Manage your
            <br />
            <span className="bg-gradient-to-br from-primary via-primary-500 to-secondary bg-clip-text text-transparent">
              business beautifully.
            </span>
          </h1>
          <p className="mt-6 text-lg muted max-w-md">
            A premium point-of-sale crafted for daily use — fast, elegant, and built around the way you actually work.
          </p>
        </motion.div>

        <motion.div
          initial={ { opacity: 0, y: 16 } }
          animate={ { opacity: 1, y: 0 } }
          transition={ { duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] } }
          className="grid grid-cols-3 gap-4 max-w-lg"
        >
          {[
            { k: '⚡', label: 'Lightning fast' },
            { k: '🔒', label: 'Stays on your device' },
            { k: '🎙', label: 'Made in Algeria' },
          ].map((f) => (
            <div key={f.label} className="glass rounded-2xl p-4">
              <div className="text-2xl">{f.k}</div>
              <p className="text-xs muted mt-2">{f.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right — Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={ { opacity: 0, y: 16, scale: 0.98 } }
          animate={ { opacity: 1, y: 0, scale: 1 } }
          transition={ { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
          className="w-full max-w-md glass-strong rounded-3xl p-8 sm:p-10"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary grid place-items-center shadow-premium mb-4">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h2 className="h-title">Welcome back</h2>
            <p className="muted text-sm mt-1">Sign in to continue to Luxury POS</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
            <Input
              label="Username"
              icon={User}
              placeholder="Omar"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              autoFocus
              autoComplete="username"
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />

            <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded-md border-gray-300 text-primary focus:ring-primary/30"
              />
              <span className="text-sm text-ink">Remember me</span>
            </label>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={submitting}
              iconRight={ArrowRight}
              className="mt-2"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="text-xs muted text-center mt-8">
            Protected area · Authorized personnel only
          </p>
        </motion.div>
      </div>
    </div>
  )
}
