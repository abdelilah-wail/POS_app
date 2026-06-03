import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

const VARIANTS = {
  success: { icon: CheckCircle2, ring: 'ring-accent/20',  iconBg: 'bg-accent/10',  iconColor: 'text-accent' },
  error:   { icon: AlertCircle,  ring: 'ring-red-200',    iconBg: 'bg-red-50',     iconColor: 'text-red-500' },
  warning: { icon: AlertTriangle,ring: 'ring-yellow-200', iconBg: 'bg-yellow-50',  iconColor: 'text-yellow-600' },
  info:    { icon: Info,         ring: 'ring-primary/20', iconBg: 'bg-primary/10', iconColor: 'text-primary' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((toast = {}) => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts((prev) => [
      ...prev,
      {
        id,
        title: toast.title || '',
        message: toast.message || '',
        variant: toast.variant || 'info',
        duration: toast.duration ?? 3500,
      },
    ])
    return id
  }, [])

  return (
    <ToastContext.Provider value={ { addToast, dismiss } }>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
              {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} dismiss={dismiss} />
              ))}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, dismiss }) {
  const v = VARIANTS[toast.variant] || VARIANTS.info
  const Icon = v.icon

  useEffect(() => {
    if (!toast.duration || toast.duration === Infinity) return
    const id = setTimeout(() => dismiss(toast.id), toast.duration)
    return () => clearTimeout(id)
  }, [toast.duration, toast.id, dismiss])

  return (
    <motion.div
      layout
      initial={ { opacity: 0, x: 24, scale: 0.95 } }
      animate={ { opacity: 1, x: 0,  scale: 1 } }
      exit={ { opacity: 0, x: 16, scale: 0.95 } }
      transition={ { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
      className={`pointer-events-auto min-w-[280px] max-w-sm bg-white rounded-2xl shadow-premium-lg ring-1 ${v.ring} p-3 flex items-start gap-3`}
    >
      <div className={`w-8 h-8 rounded-xl ${v.iconBg} grid place-items-center shrink-0`}>
        <Icon className={`w-4 h-4 ${v.iconColor}`} />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        {toast.title && <p className="text-sm font-semibold text-ink truncate">{toast.title}</p>}
        {toast.message && <p className="text-xs muted leading-relaxed mt-0.5">{toast.message}</p>}
      </div>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="Dismiss"
        className="shrink-0 w-7 h-7 rounded-lg grid place-items-center text-muted hover:text-ink hover:bg-surface transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // Safe fallback so addToast never throws even if the provider is missing
    return {
      addToast: (t) => console.warn('[Toast] <ToastProvider> missing; toast suppressed:', t),
      dismiss: () => {},
    }
  }
  return ctx
}
