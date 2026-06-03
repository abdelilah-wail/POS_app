import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import ProductCard from '../components/orders/ProductCard'
import CartPanel from '../components/orders/CartPanel'
import ReviewOrderModal from '../components/orders/ReviewOrderModal'
import { useProducts } from '../context/ProductsContext'

export default function CategoryProducts() {
  const { category: categoryKey } = useParams()
  const { getCategory, getProductsByCategory } = useProducts()
  const navigate = useNavigate()
  const [reviewOpen, setReviewOpen] = useState(false)

  const category = getCategory(categoryKey)
  if (!category) return <Navigate to="/orders/new" replace />

  const products = getProductsByCategory(categoryKey)

  return (
    <div className="section">
      <button
        onClick={() => navigate('/orders/new')}
        className="inline-flex items-center gap-1.5 text-sm muted hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> All categories
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Left: products */}
        <div>
          <motion.div
            initial={ { opacity: 0, y: 12 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
            className={`relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${category.gradient} text-white`}
          >
            <div className="absolute -bottom-6 -right-4 text-[7rem] leading-none select-none drop-shadow-lg opacity-90">
              {category.emoji}
            </div>
            <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-white/30 blur-2xl" />
            <span className="relative inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 backdrop-blur border border-white/20">
              {products.length} product{products.length !== 1 ? 's' : ''}
            </span>
            <h2 className="relative text-3xl md:text-4xl font-semibold tracking-tight mt-3">{category.name}</h2>
            <p className="relative text-white/80 text-sm mt-1 max-w-md">{category.description}</p>
          </motion.div>

          {products.length === 0 ? (
            <div className="mt-8 p-12 rounded-3xl bg-white border border-dashed border-black/[0.08] text-center">
              <p className="text-sm font-medium text-ink">No products in this category yet</p>
              <p className="text-xs muted mt-1">Add some in the Products page</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 0.05} />
              ))}
            </div>
          )}
        </div>

        <CartPanel onReview={() => setReviewOpen(true)} />
      </div>

      <ReviewOrderModal open={reviewOpen} onClose={() => setReviewOpen(false)} />
    </div>
  )
}
