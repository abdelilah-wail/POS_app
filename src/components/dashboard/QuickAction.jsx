import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function QuickAction({
  icon: Icon,
  title,
  description,
  to,
  color = 'from-primary to-secondary',
  delay = 0,
}) {
  const navigate = useNavigate()
  return (
    <motion.button
      type="button"
      onClick={() => navigate(to)}
      initial={ { opacity: 0, y: 18 } }
      animate={ { opacity: 1, y: 0 } }
      transition={ { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] } }
      whileHover={ { y: -4 } }
      whileTap={ { scale: 0.98 } }
      className="group relative text-left w-full overflow-hidden rounded-3xl p-6 bg-white border border-black/[0.04] shadow-card hover:shadow-premium-lg transition-shadow duration-500 ease-apple"
    >
      {/* Gradient backdrop on hover */}
      <div className={`absolute -inset-1 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} grid place-items-center shadow-premium`}>
            {Icon && <Icon className="w-5 h-5 text-white" />}
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-ink group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
        {description && <p className="text-sm muted mt-1">{description}</p>}
      </div>
    </motion.button>
  )
}
