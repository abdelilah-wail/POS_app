import { useEffect, useRef, useState } from 'react'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Mail, User as UserIcon, ChevronDown, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/',          label: 'Dashboard' },
  { to: '/orders/new', label: 'New Order' },
  { to: '/orders',    label: 'Orders' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/products',  label: 'Products' },
]

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [now, setNow] = useState(new Date())
  const ref = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  // close dropdown on outside click / route change
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])
  useEffect(() => { setOpen(false) }, [location.pathname])

  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-black/[0.05]">
      <div className="section py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-secondary grid place-items-center shadow-premium">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[11px] muted leading-none">{dateLabel}</p>
            <p className="text-sm font-semibold text-ink leading-tight">POS</p>
          </div>
        </button>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-surface rounded-full p-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                `px-3.5 py-1.5 text-sm rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-ink shadow-card'
                    : 'text-muted hover:text-ink'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* User menu */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-surface hover:bg-surface/60 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary grid place-items-center text-white text-xs font-semibold">
              {user?.avatar || 'O'}
            </div>
            <span className="hidden sm:inline text-sm font-medium">{user?.name || 'Omar'}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={ { opacity: 0, y: -6, scale: 0.98 } }
                animate={ { opacity: 1, y: 0, scale: 1 } }
                exit={ { opacity: 0, y: -6, scale: 0.98 } }
                transition={ { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }
                className="absolute right-0 mt-2 w-64 glass-strong rounded-2xl p-2 shadow-premium-lg"
              >
                <div className="px-3 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary grid place-items-center text-white font-semibold">
                    {user?.avatar || 'O'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{user?.name || 'Omar'}</p>
                    <p className="text-xs muted truncate flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {user?.email || 'omar@elwael.com'}
                    </p>
                  </div>
                </div>
                <div className="h-px bg-black/[0.06] my-1" />
                <button
                  onClick={() => navigate('/products')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm hover:bg-black/[0.04] text-ink transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-muted" /> Manage products
                </button>
                <button
                  onClick={() => { logout(); navigate('/login') }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm hover:bg-red-50 text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
