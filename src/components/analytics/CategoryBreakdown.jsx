import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatDA } from '../../utils/format'

const COLORS = ['#0A84FF', '#5AC8FA', '#34C759', '#FF9F0A', '#FF375F', '#BF5AF2']

export default function CategoryBreakdown({ orders, categories }) {
  const data = useMemo(() => {
    const totals = new Map()
    for (const c of categories) totals.set(c.key, { key: c.key, name: c.name, emoji: c.emoji, value: 0 })
    for (const o of orders) {
      for (const it of o.items) {
        const bucket = totals.get(it.category)
        if (bucket) bucket.value += it.price * it.qty
      }
    }
    return [...totals.values()].filter((c) => c.value > 0)
  }, [orders, categories])

  const grand = data.reduce((s, d) => s + d.value, 0)

  if (grand === 0) {
    return (
      <div className="h-64 grid place-items-center text-sm muted">No category revenue yet.</div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="w-48 h-48 relative shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
              animationDuration={900}
            >
              {data.map((entry, i) => (
                <Cell key={entry.key} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0].payload
                const pct = ((d.value / grand) * 100).toFixed(1)
                return (
                  <div className="bg-white rounded-2xl shadow-premium-lg ring-1 ring-black/[0.05] px-3 py-2.5">
                    <p className="text-xs font-semibold text-ink">{d.emoji} {d.name}</p>
                    <p className="text-sm font-semibold tabular-nums text-primary mt-1">{formatDA(d.value)}</p>
                    <p className="text-[11px] muted">{pct}%</p>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.08em] muted font-semibold">Total</p>
            <p className="text-base font-semibold tabular-nums text-ink">{formatDA(grand)}</p>
          </div>
        </div>
      </div>
      <ul className="flex-1 w-full space-y-2">
        {data.map((d, i) => (
          <li key={d.key} className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-surface/60 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={ { background: COLORS[i % COLORS.length] } } />
              <span className="text-xl">{d.emoji}</span>
              <span className="text-sm font-medium text-ink truncate">{d.name}</span>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold tabular-nums text-ink">{formatDA(d.value)}</p>
              <p className="text-[11px] muted tabular-nums">{((d.value / grand) * 100).toFixed(1)}%</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
