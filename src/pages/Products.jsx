import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, RotateCcw, Package, Search } from 'lucide-react'
import { useProducts } from '../context/ProductsContext'
import { useToast } from '../components/ui'
import { formatDA } from '../utils/format'
import ProductFormModal from '../components/products/ProductFormModal'
import DeleteProductModal from '../components/products/DeleteProductModal'

export default function Products() {
  const { products, categories, deleteProduct, resetToDefaults } = useProducts()
  const { addToast } = useToast()

  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [resetOpen, setResetOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (filter !== 'all' && p.category !== filter) return false
      if (q && !p.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [products, filter, query])

  const countsByCategory = useMemo(() => {
    const map = { all: products.length }
    for (const c of categories) {
      map[c.key] = products.filter((p) => p.category === c.key).length
    }
    return map
  }, [products, categories])

  const handleAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleEdit = (product) => {
    setEditing(product)
    setFormOpen(true)
  }

  const handleConfirmDelete = () => {
  if (!deleting) return
  const product = deleting
  setDeleting(null) // close first so the modal always dismisses
  try {
    deleteProduct(product.id)
    addToast({ title: 'Product deleted', message: product.name, variant: 'success' })
  } catch (err) {
    console.error('Product delete failed', err)
  }
}

const handleReset = () => {
  setResetOpen(false) // close first so the modal always dismisses
  try {
    resetToDefaults()
    addToast({ title: 'Catalog reset', message: 'Default products restored', variant: 'info' })
  } catch (err) {
    console.error('Catalog reset failed', err)
  }
}

  return (
    <div className="section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] muted font-medium">Catalog</p>
          <h1 className="h-title mt-1">Products</h1>
          <p className="muted text-sm mt-1">Manage what your customers can order.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white border border-black/[0.06] text-ink text-sm font-medium hover:bg-surface active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-premium hover:shadow-premium-lg active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} count={countsByCategory.all}>
            All
          </FilterChip>
          {categories.map((c) => (
            <FilterChip
              key={c.key}
              active={filter === c.key}
              onClick={() => setFilter(c.key)}
              count={countsByCategory[c.key] || 0}
              emoji={c.emoji}
            >
              {c.name}
            </FilterChip>
          ))}
        </div>
        <div className="relative md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface border border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/15 outline-none text-sm transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState hasAny={products.length > 0} filter={filter} onAdd={handleAdd} />
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={ { opacity: 0, y: 14 } }
                animate={ { opacity: 1, y: 0 } }
                exit={ { opacity: 0, scale: 0.97 } }
                transition={ { duration: 0.4, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] } }
                className="group relative bg-white rounded-3xl border border-black/[0.05] shadow-card hover:shadow-premium-lg transition-all duration-500 ease-apple overflow-hidden"
              >
                <div className="h-28 bg-gradient-to-br from-surface to-white grid place-items-center relative">
                  <span className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-500 ease-apple">
                    {p.emoji || '🛍️'}
                  </span>
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/80 backdrop-blur border border-black/[0.04] text-ink">
                    {categories.find((c) => c.key === p.category)?.emoji} {categories.find((c) => c.key === p.category)?.name || p.category}
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="text-base font-semibold text-ink leading-snug truncate">{p.name}</h4>
                  <p className="text-2xl font-semibold tracking-tight text-ink mt-1 tabular-nums">{formatDA(p.price)}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(p)}
                      className="flex-1 px-3 py-2 rounded-xl bg-surface text-ink text-sm font-medium hover:bg-surface/70 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(p)}
                      aria-label="Delete product"
                      className="w-10 h-10 rounded-xl grid place-items-center text-muted hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modals */}
      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editing}
      />
      <DeleteProductModal
        open={Boolean(deleting)}
        product={deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={handleConfirmDelete}
      />
      <ResetConfirmModal
        open={resetOpen}
        onCancel={() => setResetOpen(false)}
        onConfirm={handleReset}
      />
    </div>
  )
}

function FilterChip({ active, count, emoji, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 ${
        active
          ? 'bg-ink text-white shadow-premium'
          : 'bg-white border border-black/[0.06] text-ink hover:bg-surface'
      }`}
    >
      {emoji && <span>{emoji}</span>}
      <span>{children}</span>
      <span className={`tabular-nums text-[11px] px-1.5 py-0.5 rounded-full ${active ? 'bg-white/15' : 'bg-surface'}`}>
        {count}
      </span>
    </button>
  )
}

function EmptyState({ hasAny, filter, onAdd }) {
  return (
    <div className="p-14 rounded-3xl bg-white border border-dashed border-black/[0.08] text-center">
      <div className="w-14 h-14 rounded-2xl bg-surface mx-auto grid place-items-center mb-4">
        <Package className="w-6 h-6 text-muted" />
      </div>
      <p className="text-base font-semibold text-ink">
        {hasAny ? 'No products match' : 'No products yet'}
      </p>
      <p className="text-sm muted mt-1">
        {hasAny
          ? filter === 'all' ? 'Try a different search.' : 'Try a different category or clear the search.'
          : 'Add your first product to get started.'}
      </p>
      {!hasAny && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-premium hover:shadow-premium-lg active:scale-[0.98] transition-all inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add a product
        </button>
      )}
    </div>
  )
}

function ResetConfirmModal({ open, onCancel, onConfirm }) {
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
          onClick={onCancel}
        >
          <motion.div
            initial={ { opacity: 0, y: 16, scale: 0.97 } }
            animate={ { opacity: 1, y: 0, scale: 1 } }
            exit={ { opacity: 0, y: 12, scale: 0.98 } }
            transition={ { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-premium-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 grid place-items-center mb-4">
                <RotateCcw className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-ink tracking-tight">Reset to defaults?</h3>
              <p className="text-sm muted mt-1">
                This restores the original 8 products. Any custom products you added will be removed. Saved orders are not affected.
              </p>
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
                className="flex-1 px-4 py-3 rounded-xl bg-ink text-white text-sm font-semibold shadow-premium hover:bg-ink/90 hover:shadow-premium-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
