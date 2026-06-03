import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { formatDA } from '../../utils/format'

function buildSeries(orders, days = 30) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const buckets = new Map()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    buckets.set(key, { date: key, label: `${d.getMonth() + 1}/${d.getDate()}`, revenue: 0, orders: 0 })
  }
  for (const o of orders) {
    const key = new Date(o.createdAt).toISOString().slice(0, 10)
    const bucket = buckets.get(key)
    if (bucket) {
      bucket.revenue += o.total
      bucket.orders += 1
    }
  }
  return [...buckets.values()]
}

function TooltipBox({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  const { revenue, orders } = payload[0].payload
  return (
    <div className="bg-white rounded-2xl shadow-premium-lg ring-1 ring-black/[0.05] px-3 py-2.5">
      <p className="text-xs font-semibold text-ink">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-primary mt-1">{formatDA(revenue)}</p>
      <p className="text-[11px] muted">{orders} order{orders !== 1 && 's'}</p>
    </div>
  )
}

export default function RevenueChart({ orders, days = 30 }) {
  const data = useMemo(() => buildSeries(orders, days), [orders, days])
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={ { top: 10, right: 10, left: 0, bottom: 0 } }>
          <defs>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0A84FF" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#0A84FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis dataKey="label" stroke="#86868B" fontSize={11} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis stroke="#86868B" fontSize={11} tickLine={false} axisLine={false} width={48} tickFormatter={(v) => `${v}`} />
          <Tooltip content={<TooltipBox />} cursor={ { stroke: '#0A84FF', strokeDasharray: '3 3', strokeOpacity: 0.4 } } />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0A84FF"
            strokeWidth={2.5}
            fill="url(#revFill)"
            isAnimationActive={true}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
