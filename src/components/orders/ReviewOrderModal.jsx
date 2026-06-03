import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { X, Receipt, CalendarDays, Hash, CheckCircle2, ListOrdered, Plus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useOrders } from '../../context/OrdersContext'
import { useToast } from '../ui'
import { formatDA, formatDateTime } from '../../utils/format'

export default function ReviewOrderModal({ open, onClose }) {
  const { items, total, count, clear } = useCart()
  const { addOrder, getNextOrderId } = useOrders()
  const { addToast } = useToast()
  const navigate = useNavigate()

  // 'review' → 'saving' → 'success'
  const [phase, setPhase] = useState('review')
  const [savedOrder, setSavedOrder] = useState(null)

  // Capture the previewed ID once when the modal opens so it doesn't flicker.
  const previewId = useMemo(() => (open ? getNextOrderId() : null), [open, getNextOrderId])
  const previewDate = useMemo(() => new Date(), [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset state when the modal closes/opens.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setPhase('review')
        setSavedOrder(null)
      }, 250)
      return () => clearTimeout(t)
    }
  }, [open])

  const handleSave = async () => {
    if (items.length === 0) return
    setPhase('saving')
    // Tiny artificial delay so the success transition feels intentional
    await new Promise((r) => setTimeout(r, 280))
    const order = addOrder(items)
    setSavedOrder(order)
    clear()
    setPhase('success')
    addToast({
      title: `Order ${order.id} saved`,
      message: `${formatDA(order.total)} · ${order.items.length} item${order.items.length !== 1 ? 's' : ''}`,
      variant: 'success',
    })
  }

  const handleMakeAnother = () => {
    onClose()
    navigate('/orders/new')
  }

  const handleDone = () => {
    onClose()
    navigate('/')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={ { opacity: 0 } }
          animate={ { opacity: 1 } }
          exit={ { opacity: 0 } }
          transition={ { duration: 0.22 } }
          className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-md grid place-items-center p-4"
          onClick={phase === 'review' ? onClose : undefined}
        >
          <motion.div
            key="sheet"
            initial={ { opacity: 0, y: 24, scale: 0.97 } }
            animate={ { opacity: 1, y: 0, scale: 1 } }
            exit={ { opacity: 0, y: 16, scale: 0.98 } }
            transition={ { duration: 0.32, ease: [0.16, 1, 0.3, 1] } }
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-premium-lg overflow-hidden"
          >
            {/* Close button */}
            {phase === 'review' && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-surface grid place-items-center text-muted hover:text-ink hover:bg-surface/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <AnimatePresence mode="wait">
              {phase !== 'success' ? (
                <motion.div
                  key="review"
                  initial={ { opacity: 0 } }
                  animate={ { opacity: 1 } }
                  exit={ { opacity: 0 } }
                  transition={ { duration: 0.2 } }
                >
                  {/* Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary grid place-items-center shadow-premium">
                        <Receipt className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-ink">Review your order</h3>
                        <p className="text-xs muted">Check everything before saving</p>
                      </div>
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-wrap items-center gap-2 mt-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface text-xs font-medium text-ink">
                        <Hash className="w-3 h-3" /> {previewId}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface text-xs muted">
                        <CalendarDays className="w-3 h-3" /> {formatDateTime(previewDate)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface text-xs muted">
                        <ListOrdered className="w-3 h-3" /> {count} item{count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="max-h-[320px] overflow-y-auto px-6">
                    {items.length === 0 ? (
                      <div className="py-10 text-center muted text-sm">Cart is empty.</div>
                    ) : (
                      <ul className="divide-y divide-black/[0.05]">
                        {items.map((item) => (
                          <li key={item.productId} className="flex items-center gap-3 py-3">
                            <span className="text-2xl shrink-0">{item.emoji}</span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                              <p className="text-xs muted tabular-nums">
                                {formatDA(item.price)} × {item.qty}
                              </p>
                            </div>
                            <p className="text-sm font-semibold tabular-nums text-ink shrink-0">
                              {formatDA(item.price * item.qty)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Total */}
                  <div className="px-6 pt-4">
                    <div className="flex items-baseline justify-between p-4 rounded-2xl bg-gradient-to-br from-surface to-white border border-black/[0.04]">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.08em] muted font-medium">Grand total</p>
                        <p className="text-xs muted mt-0.5">{count} item{count !== 1 ? 's' : ''} in this order</p>
                      </div>
                      <p className="text-3xl font-semibold tabular-nums text-ink tracking-tight">{formatDA(total)}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 pt-5 flex flex-col-reverse sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={phase === 'saving'}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-surface text-ink text-sm font-medium hover:bg-surface/70 active:scale-[0.98] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={items.length === 0 || phase === 'saving'}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-premium disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-premium-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      {phase === 'saving' ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Save order
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={ { opacity: 0 } }
                  animate={ { opacity: 1 } }
                  exit={ { opacity: 0 } }
                  transition={ { duration: 0.22 } }
                  className="p-8 text-center"
                >
                  {/* Animated check */}
                  <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-accent/15 to-accent/5 grid place-items-center">
                    <svg viewBox="0 0 80 80" className="w-20 h-20">
                      <motion.circle
                        cx="40" cy="40" r="34"
                        fill="none"
                        stroke="#34C759"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={ { pathLength: 0, opacity: 0 } }
                        animate={ { pathLength: 1, opacity: 1 } }
                        transition={ { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
                      />
                      <motion.path
                        d="M 26 42 L 36 52 L 56 30"
                        fill="none"
                        stroke="#34C759"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={ { pathLength: 0 } }
                        animate={ { pathLength: 1 } }
                        transition={ { duration: 0.45, delay: 0.35, ease: [0.16, 1, 0.3, 1] } }
                      />
                    </svg>
                  </div>

                  <motion.h3
                    initial={ { opacity: 0, y: 8 } }
                    animate={ { opacity: 1, y: 0 } }
                    transition={ { duration: 0.4, delay: 0.5 } }
                    className="mt-5 text-xl font-semibold text-ink tracking-tight"
                  >
                    Order saved
                  </motion.h3>

                  <motion.p
                    initial={ { opacity: 0, y: 8 } }
                    animate={ { opacity: 1, y: 0 } }
                    transition={ { duration: 0.4, delay: 0.6 } }
                    className="muted text-sm mt-1"
                  >
                    {savedOrder?.id} · {formatDA(savedOrder?.total || 0)}
                  </motion.p>

                  <motion.div
                    initial={ { opacity: 0, y: 12 } }
                    animate={ { opacity: 1, y: 0 } }
                    transition={ { duration: 0.45, delay: 0.7 } }
                    className="mt-7 flex flex-col-reverse sm:flex-row gap-3"
                  >
                    <button
                      type="button"
                      onClick={handleDone}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-surface text-ink text-sm font-medium hover:bg-surface/70 active:scale-[0.98] transition-all"
                    >
                      Back to dashboard
                    </button>
                    <button
                      type="button"
                      onClick={handleMakeAnother}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-premium hover:shadow-premium-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Make another order
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
