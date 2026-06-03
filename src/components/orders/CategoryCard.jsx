import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CategoryCard({ category, count, priceRange, delay = 0 }) {
  const navigate = useNavigate()

  return (
    <motion.button
      type="button"
      onClick={() => navigate(`/orders/new/${category.key}`)}
      initial={ { opacity: 0, y: 24 } }
      animate={ { opacity: 1, y: 0 } }
      transition={ { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] } }
      whileHover={ { y: -6 } }
      whileTap={ { scale: 0.985 } }
      className="group relative text-left w-full overflow-hidden rounded-[2rem] bg-white border border-black/[0.04] shadow-card hover:shadow-premium-lg transition-shadow duration-500 ease-apple"
    >
      {/* Gradient hero */}
      <div className={`relative h-44 bg-gradient-to-br ${category.gradient} overflow-hidden`}>
        {/* Big emoji */}
        <div className="absolute -bottom-6 -right-4 text-[9rem] leading-none select-none drop-shadow-lg">
          {category.emoji}
        </div>
        {/* Soft top-left highlight */}
        <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-white/30 blur-2xl" />
        {/* Shimmer sweep on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-apple" />
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-2xl font-semibold text-ink tracking-tight">{category.name}</h3>
            <p className="text-sm muted mt-1">{category.description}</p>
          </div>
          <div className="shrink-0 w-10 h-10 rounded-full bg-surface grid place-items-center group-hover:bg-ink group-hover:text-white transition-colors duration-300 ease-apple">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-surface muted font-medium">
            {count} product{count !== 1 ? 's' : ''}
          </span>
          <span className="muted">{priceRange}</span>
        </div>
      </div>
    </motion.button>
  )
}
