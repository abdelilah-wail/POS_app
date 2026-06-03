import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart, ListOrdered, BarChart3, Package,
  Wallet, TrendingUp, Receipt, CalendarDays, Inbox,
} from 'lucide-react'
import { Button, GlassCard, Badge } from '../components/ui'
import StatCard from '../components/dashboard/StatCard'
import QuickAction from '../components/dashboard/QuickAction'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { formatDA, formatDateTime, greeting } from '../utils/format'

export default function Dashboard() {
  const { user } = useAuth()
  const { orders, stats } = useOrders()
  const navigate = useNavigate()

  const recent = useMemo(() => orders.slice(0, 5), [orders])
  const hello = greeting()

  return (
    <div className="section">
      {/* Hero */}
      <motion.div
        initial={ { opacity: 0, y: 12 } }
        animate={ { opacity: 1, y: 0 } }
        transition={ { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
      >
        <div>
          <Badge variant="primary">
            <CalendarDays className="w-3 h-3" />
            {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
          </Badge>
          <h2 className="h-display mt-3">
            {hello},{' '}
            <span className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
              {user?.name || 'Omar'}
            </span>
          </h2>
          <p className="muted mt-1">Here's how your business is doing today.</p>
        </div>

        <Button size="lg" icon={ShoppingCart} onClick={() => navigate('/orders/new')}>
          Create New Order
        </Button>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        <StatCard
          icon={Wallet}
          label="Today Revenue"
          value={stats.todayRevenue}
          formatter={formatDA}
          color="from-primary to-secondary"
          hint="Resets every day"
          delay={0.00}
        />
        <StatCard
          icon={TrendingUp}
          label="Total Revenue"
          value={stats.totalRevenue}
          formatter={formatDA}
          color="from-secondary to-accent"
          hint="All time"
          delay={0.05}
        />
        <StatCard
          icon={Receipt}
          label="Today Orders"
          value={stats.todayOrders}
          formatter={(v) => Math.round(v).toLocaleString()}
          color="from-accent to-primary"
          hint="Orders today"
          delay={0.10}
        />
        <StatCard
          icon={ListOrdered}
          label="Total Orders"
          value={stats.totalOrders}
          formatter={(v) => Math.round(v).toLocaleString()}
          color="from-primary to-accent"
          hint="All time"
          delay={0.15}
        />
      </div>

      {/* Quick actions */}
      <h3 className="h-section mt-12 mb-4">Quick actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <QuickAction
          icon={ShoppingCart}
          title="New Order"
          description="Start a fresh order in seconds."
          to="/orders/new"
          color="from-primary to-secondary"
          delay={0.00}
        />
        <QuickAction
          icon={ListOrdered}
          title="View Orders"
          description="Browse, search and export."
          to="/orders"
          color="from-secondary to-accent"
          delay={0.05}
        />
        <QuickAction
          icon={BarChart3}
          title="Analytics"
          description="Revenue trends & insights."
          to="/analytics"
          color="from-accent to-primary"
          delay={0.10}
        />
        <QuickAction
          icon={Package}
          title="Products"
          description="Manage your catalog."
          to="/products"
          color="from-primary to-accent"
          delay={0.15}
        />
      </div>

      {/* Recent orders preview */}
      <h3 className="h-section mt-12 mb-4">Recent orders</h3>
      <GlassCard className="p-0 overflow-hidden">
        {recent.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-surface grid place-items-center mb-4">
              <Inbox className="w-6 h-6 text-muted" />
            </div>
            <h4 className="h-section">No orders yet</h4>
            <p className="muted text-sm mt-1 max-w-sm">
              When you create your first order, it'll show up here. The stat cards above will update too.
            </p>
            <Button className="mt-6" icon={ShoppingCart} onClick={() => navigate('/orders/new')}>
              Create your first order
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-black/[0.05]">
            {recent.map((o) => (
              <li key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-black/[0.02] transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{o.id}</p>
                  <p className="text-xs muted">
                    {formatDateTime(o.createdAt)} · {o.items.length} item{o.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums text-ink">{formatDA(o.total)}</p>
                  <Badge variant="success" className="mt-1">Saved</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  )
}
