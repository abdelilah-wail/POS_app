import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  '2xl': 'max-w-3xl',
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={ { opacity: 0 } }
          animate={ { opacity: 1 } }
          exit={ { opacity: 0 } }
          transition={ { duration: 0.2 } }
        >
          {/* Backdrop */}
          <div
            onClick={() => closeOnBackdrop && onClose?.()}
            className="absolute inset-0 bg-black/30 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            initial={ { opacity: 0, scale: 0.96, y: 12 } }
            animate={ { opacity: 1, scale: 1, y: 0 } }
            exit={ { opacity: 0, scale: 0.98, y: 4 } }
            transition={ { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
            className={`relative w-full ${SIZES[size]} bg-white rounded-3xl shadow-premium-lg border border-black/[0.04] overflow-hidden`}
          >
            {(title || onClose) && (
              <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
                <div className="min-w-0">
                  {title && <h2 className="h-section text-ink">{title}</h2>}
                  {subtitle && <p className="text-sm muted mt-1">{subtitle}</p>}
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="shrink-0 p-2 rounded-full text-muted hover:text-ink hover:bg-black/5 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            <div className="px-6 pb-6 max-h-[70vh] overflow-y-auto">
              {children}
            </div>

            {footer && (
              <div className="px-6 py-4 border-t border-black/[0.05] bg-surface/60 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
