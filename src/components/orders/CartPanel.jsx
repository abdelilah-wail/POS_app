import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Trash2, X, Plus, Minus, Receipt, LayoutGrid } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatDA } from '../../utils/format'

export default function CartPanel({ onReview }) {
  const { items, total, count, increment, decrement, removeItem, clear } = useCart()
  const navigate = useNavigate()

  return (
    <aside className="lg:sticky lg:top-24 bg-white rounded-3xl border border-black/[0.04] shadow-card overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-black/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary grid place-items-center shadow-premium">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Your order</h3>
            <p className="text-xs muted">{count} item{count !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {items.length > 0 && (
          <button
            onClick={clear}
            type="button"
            className="text-xs muted hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Items */}
      <div className="max-h-[420px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-surface mx-auto grid place-items-center mb-3">
              <ShoppingBag className="w-5 h-5 text-muted" />
            </div>
            <p className="text-sm font-medium text-ink">Cart is empty</p>
            <p className="text-xs muted mt-1">Add products to get started</p>
          </div>
        ) : (
          <ul className="divide-y divide-black/[0.05]">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.li
                  key={item.productId}
                  layout
                  initial={ { opacity: 0, height: 0 } }
                  animate={ { opacity: 1, height: 'auto' } }
                  exit={ { opacity: 0, height: 0 } }
                  transition={ { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }
                  className="px-5 py-3 flex items-center gap-3"
                >
                  <span className="text-2xl shrink-0">{item.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                    <p className="text-xs muted tabular-nums">
                      {formatDA(item.price)} · <span className="font-medium text-ink/70">{formatDA(item.qty * item.price)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => decrement(item.productId)}
                      type="button"
                      className="w-7 h-7 rounded-lg bg-surface grid place-items-center hover:bg-surface/60 active:scale-95 transition-all"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold tabular-nums">{item.qty}</span>
                    <button
                      onClick={() => increment(item.productId)}
                      type="button"
                      className="w-7 h-7 rounded-lg bg-ink text-white grid place-items-center hover:opacity-90 active:scale-95 transition-all"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    type="button"
                    className="shrink-0 w-7 h-7 rounded-lg grid place-items-center text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                    aria-label="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-black/[0.05] bg-gradient-to-b from-white to-surface/40 space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-[0.08em] muted font-medium">Total</span>
          <motion.span
            key={total}
            initial={ { opacity: 0, y: -4 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.25 } }
            className="text-2xl font-semibold tabular-nums text-ink"
          >
            {formatDA(total)}
          </motion.span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/orders/new')}
          className="w-full px-4 py-2.5 rounded-xl bg-surface text-ink text-sm font-medium hover:bg-surface/70 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
        >
          <LayoutGrid className="w-4 h-4" /> Add another category
        </button>

        <button
          type="button"
          onClick={onReview}
          disabled={items.length === 0}
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-premium disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-premium-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Receipt className="w-4 h-4" /> Review order
        </button>
      </div>
    </aside>
  )
}
