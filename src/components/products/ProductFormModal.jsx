import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Plus, Package } from 'lucide-react'
import { useProducts } from '../../context/ProductsContext'
import { useToast } from '../ui'

const EMOJI_PRESETS = ['💧', '🥤', '🍦', '🥞', '🍌', '✨', '🧃', '☕', '🍵', '🧁', '🍪', '🍩', '🍰', '🧇', '🥪', '🌭', '🍕', '🍔', '🍗', '🥗']

function makeProductId(name, category) {
  const slug = String(name || 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 24)
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${category || 'misc'}-${slug || 'item'}-${suffix}`
}

export default function ProductFormModal({ open, onClose, product = null }) {
  const { categories, addProduct, updateProduct } = useProducts()
  const { addToast } = useToast()
  const isEdit = Boolean(product)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [emoji, setEmoji] = useState('🛍️')
  const [category, setCategory] = useState(categories[0]?.key || '')
  const [errors, setErrors] = useState({})

  // Reset/prefill on open
  useEffect(() => {
    if (open) {
      setName(product?.name || '')
      setPrice(product?.price != null ? String(product.price) : '')
      setEmoji(product?.emoji || '🛍️')
      setCategory(product?.category || categories[0]?.key || '')
      setErrors({})
    }
  }, [open, product, categories])

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Required'
    const p = Number(price)
    if (!price || Number.isNaN(p) || p <= 0) e.price = 'Must be a positive number'
    if (!category) e.category = 'Pick a category'
    setErrors(e)
    return Object.keys(e).length === 0
  }

 const handleSubmit = (event) => {
  event.preventDefault()
  if (!validate()) return
  const payload = {
    name: name.trim(),
    price: Number(price),
    emoji: emoji || '🛍️',
    category,
  }
  // Close FIRST so the modal always dismisses, even if a downstream call throws.
  onClose()
  try {
    if (isEdit) {
      updateProduct(product.id, payload)
      addToast({ title: 'Product updated', message: `${payload.name} saved`, variant: 'success' })
    } else {
      addProduct({ id: makeProductId(payload.name, payload.category), ...payload })
      addToast({ title: 'Product added', message: payload.name, variant: 'success' })
    }
  } catch (err) {
    console.error('Product save failed', err)
  }
}

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={ { opacity: 0 } }
          animate={ { opacity: 1 } }
          exit={ { opacity: 0 } }
          transition={ { duration: 0.2 } }
          className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-md grid place-items-center p-4"
          onClick={onClose}
        >
          <motion.form
            key="sheet"
            onSubmit={handleSubmit}
            initial={ { opacity: 0, y: 24, scale: 0.97 } }
            animate={ { opacity: 1, y: 0, scale: 1 } }
            exit={ { opacity: 0, y: 16, scale: 0.98 } }
            transition={ { duration: 0.32, ease: [0.16, 1, 0.3, 1] } }
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-premium-lg overflow-hidden"
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-surface grid place-items-center text-muted hover:text-ink hover:bg-surface/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="p-6 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary grid place-items-center shadow-premium">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink">{isEdit ? 'Edit product' : 'New product'}</h3>
                  <p className="text-xs muted">{isEdit ? 'Update name, price, emoji, or category' : 'Add a product to your catalog'}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Emoji picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.06em] muted mb-2">Emoji</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-surface to-white border border-black/[0.05] grid place-items-center text-4xl shrink-0">
                    {emoji}
                  </div>
                  <div className="flex-1 grid grid-cols-10 gap-1.5">
                    {EMOJI_PRESETS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setEmoji(e)}
                        className={`aspect-square rounded-lg text-lg transition-all hover:bg-surface active:scale-90 ${
                          emoji === e ? 'bg-primary/10 ring-1 ring-primary/30' : ''
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value.slice(0, 4))}
                  placeholder="Or paste any emoji"
                  className="mt-2 w-full px-3 py-2 rounded-xl bg-surface border border-transparent focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/15 outline-none text-sm transition-all"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.06em] muted mb-2">Product name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Banana Crepe"
                  className={`w-full px-4 py-2.5 rounded-xl bg-surface border focus:bg-white focus:ring-2 outline-none text-sm transition-all ${
                    errors.name
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                      : 'border-transparent focus:border-primary/30 focus:ring-primary/15'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Price + category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.06em] muted mb-2">Price (DA)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className={`w-full px-4 py-2.5 rounded-xl bg-surface border focus:bg-white focus:ring-2 outline-none text-sm tabular-nums transition-all ${
                      errors.price
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-transparent focus:border-primary/30 focus:ring-primary/15'
                    }`}
                  />
                  {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.06em] muted mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl bg-surface border focus:bg-white focus:ring-2 outline-none text-sm transition-all ${
                      errors.category
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-transparent focus:border-primary/30 focus:ring-primary/15'
                    }`}
                  >
                    {categories.map((c) => (
                      <option key={c.key} value={c.key}>{c.emoji} {c.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-3 flex flex-col-reverse sm:flex-row gap-3 border-t border-black/[0.05] bg-gradient-to-b from-white to-surface/40">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface text-ink text-sm font-medium hover:bg-surface/70 active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-premium hover:shadow-premium-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isEdit ? 'Save changes' : 'Add product'}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
