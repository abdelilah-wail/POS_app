import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, AlertTriangle } from 'lucide-react'
import { formatDA } from '../../utils/format'

export default function DeleteProductModal({ open, product, onCancel, onConfirm }) {
  return (
    <AnimatePresence>
      {open && product && (
        <motion.div
          key="backdrop"
          initial={ { opacity: 0 } }
          animate={ { opacity: 1 } }
          exit={ { opacity: 0 } }
          transition={ { duration: 0.2 } }
          className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-md grid place-items-center p-4"
          onClick={onCancel}
        >
          <motion.div
            key="sheet"
            initial={ { opacity: 0, y: 16, scale: 0.97 } }
            animate={ { opacity: 1, y: 0, scale: 1 } }
            exit={ { opacity: 0, y: 12, scale: 0.98 } }
            transition={ { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-premium-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 grid place-items-center mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-ink tracking-tight">Delete this product?</h3>
              <p className="text-sm muted mt-1">
                Existing orders that already used this product will keep their snapshot — only future orders are affected.
              </p>

              {/* Product preview */}
              <div className="mt-5 p-4 rounded-2xl bg-surface flex items-center gap-3">
                <span className="text-3xl">{product.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink truncate">{product.name}</p>
                  <p className="text-xs muted tabular-nums">{formatDA(product.price)}</p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface text-ink text-sm font-medium hover:bg-surface/70 active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold shadow-premium hover:bg-red-600 hover:shadow-premium-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
