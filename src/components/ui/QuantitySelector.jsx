import { motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'

export default function QuantitySelector({
  value = 0,
  onChange,
  min = 0,
  max = 999,
  size = 'md',
}) {
  const dec = () => onChange?.(Math.max(min, value - 1))
  const inc = () => onChange?.(Math.min(max, value + 1))

  const sizes = {
    sm: { btn: 'w-7 h-7',  text: 'text-sm w-6'  },
    md: { btn: 'w-9 h-9',  text: 'text-base w-8' },
    lg: { btn: 'w-11 h-11', text: 'text-lg w-10' },
  }
  const s = sizes[size] || sizes.md

  return (
    <div className="inline-flex items-center gap-1.5 bg-surface rounded-full p-1">
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        className={`${s.btn} rounded-full grid place-items-center bg-white shadow-card text-ink transition-all duration-200 ease-apple hover:shadow-card-hover active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Decrease"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <motion.span
        key={value}
        initial={ { opacity: 0, y: -4 } }
        animate={ { opacity: 1, y: 0 } }
        transition={ { duration: 0.18 } }
        className={`${s.text} text-center font-semibold tabular-nums text-ink`}
      >
        {value}
      </motion.span>

      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        className={`${s.btn} rounded-full grid place-items-center bg-primary text-white shadow-premium transition-all duration-200 ease-apple hover:bg-primary-600 hover:shadow-premium-lg active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Increase"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
