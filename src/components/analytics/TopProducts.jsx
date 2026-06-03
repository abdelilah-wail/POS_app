import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { formatDA } from '../../utils/format'

export default function TopProducts({ orders, limit = 5 }) {
  const top = useMemo(() => {
    const map = new Map()
    for (const o of orders) {
      for (const it of o.items) {
        const existing = map.get(it.productId) || {
          productId: it.productId,
          name: it.name,
          emoji: it.emoji,
          category: it.category,
          qty: 0,
          revenue: 0,
        }
        existing.qty += it.qty
        existing.revenue += it.price * it.qty
        map.set(it.productId, existing)
      }
    }
    return [...map.values()].sort((a, b) => b.qty - a.qty).slice(0, limit)
  }, [orders, limit])

  if (top.length === 0) {
    return <div className="h-32 grid place-items-center text-sm muted">No product sales yet.</div>
  }

  const maxQty = top[0].qty

  return (
    <ol className="space-y-2.5">
      {top.map((p, i) => {
        const pct = (p.qty / maxQty) * 100
        return (
          <motion.li
            key={p.productId}
            initial={ { opacity: 0, x: -8 } }
            animate={ { opacity: 1, x: 0 } }
            transition={ { duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] } }
            className="relative flex items-center gap-3 p-3 rounded-2xl bg-white border border-black/[0.05] overflow-hidden"
          >
            <div className="absolute inset-y-0 left-0 bg-primary/5" style={ { width: `${pct}%` } } aria-hidden />
            <div className="relative w-7 h-7 grid place-items-center rounded-lg bg-ink text-white text-xs font-bold tabular-nums shrink-0">
              {i + 1}
            </div>
            <span className="relative text-2xl shrink-0">{p.emoji}</span>
            <div className="relative min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink truncate">{p.name}</p>
              <p className="text-[11px] muted">{p.qty} sold</p>
            </div>
            <p className="relative text-sm font-semibold tabular-nums text-ink shrink-0">{formatDA(p.revenue)}</p>
          </motion.li>
        )
      })}
    </ol>
  )
}
