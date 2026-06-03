import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { Badge } from '../components/ui'
import CategoryCard from '../components/orders/CategoryCard'
import { useProducts } from '../context/ProductsContext'
import { formatDA } from '../utils/format'

export default function NewOrder() {
  const { categories, getProductsByCategory } = useProducts()
  const navigate = useNavigate()

  return (
    <div className="section">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-sm muted hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </button>

      <motion.div
        initial={ { opacity: 0, y: 12 } }
        animate={ { opacity: 1, y: 0 } }
        transition={ { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
      >
        <Badge variant="primary">
          <ShoppingCart className="w-3 h-3" /> New Order
        </Badge>
        <h2 className="h-display mt-3">
          What are you{' '}
          <span className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
            serving today?
          </span>
        </h2>
        <p className="muted mt-1 max-w-xl">
          Choose a category to start adding items. You'll be able to mix products from multiple categories in the same order.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {categories.map((cat, i) => {
          const list = getProductsByCategory(cat.key)
          const prices = list.map((p) => p.price).filter((n) => Number.isFinite(n))
          const min = prices.length ? Math.min(...prices) : 0
          const max = prices.length ? Math.max(...prices) : 0
          const range = list.length
            ? (min === max ? formatDA(min) : `${formatDA(min)} — ${formatDA(max)}`)
            : 'No products yet'

          return (
            <CategoryCard
              key={cat.key}
              category={cat}
              count={list.length}
              priceRange={range}
              delay={i * 0.08}
            />
          )
        })}
      </div>
    </div>
  )
}
