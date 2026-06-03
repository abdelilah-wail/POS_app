import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatDA } from '../../utils/format'

export default function ProductCard({ product, delay = 0 }) {
  const { getQty, increment, decrement, addItem } = useCart()
  const qty = getQty(product.id)
  const inCart = qty > 0

  return (
    <motion.div
      initial={ { opacity: 0, y: 18 } }
      animate={ { opacity: 1, y: 0 } }
      transition={ { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] } }
      className={`group relative bg-white rounded-3xl border transition-all duration-500 ease-apple overflow-hidden ${
        inCart
          ? 'border-primary/30 shadow-premium ring-1 ring-primary/10'
          : 'border-black/[0.05] shadow-card hover:shadow-premium-lg'
      }`}
    >
      {/* Emoji hero */}
      <div className="h-32 bg-gradient-to-br from-surface to-white grid place-items-center relative overflow-hidden">
        <span className="text-6xl drop-shadow-sm group-hover:scale-110 transition-transform duration-500 ease-apple">
          {product.emoji || '🛍️'}
        </span>
        {inCart && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-semibold tracking-wide">
            × {qty}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h4 className="text-base font-semibold text-ink leading-snug truncate">{product.name}</h4>
        <p className="text-2xl font-semibold tracking-tight text-ink mt-1 tabular-nums">
          {formatDA(product.price)}
        </p>

        {!inCart ? (
          <button
            type="button"
            onClick={() => addItem(product)}
            className="mt-4 w-full px-4 py-2.5 rounded-xl bg-ink text-white text-sm font-medium hover:bg-ink/90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add to order
          </button>
        ) : (
          <div className="mt-4 flex items-center justify-between bg-surface rounded-xl p-1">
            <button
              type="button"
              onClick={() => decrement(product.id)}
              className="w-9 h-9 rounded-lg bg-white shadow-card grid place-items-center hover:scale-105 active:scale-95 transition-transform"
              aria-label="Decrease"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-base font-semibold tabular-nums">{qty}</span>
            <button
              type="button"
              onClick={() => increment(product.id)}
              className="w-9 h-9 rounded-lg bg-ink text-white shadow-card grid place-items-center hover:scale-105 active:scale-95 transition-transform"
              aria-label="Increase"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
