import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, ShoppingBag, FileDown, FileSpreadsheet, Sparkles } from 'lucide-react'
import { useOrders } from '../context/OrdersContext'
import { useProducts } from '../context/ProductsContext'
import { useToast } from '../components/ui'
import { formatDA } from '../utils/format'
import { isToday, isThisWeek, isThisMonth } from '../utils/dateRange'
import { exportOrdersToPDF, exportOrdersToExcel } from '../utils/export'
import RevenueChart from '../components/analytics/RevenueChart'
import CategoryBreakdown from '../components/analytics/CategoryBreakdown'
import TopProducts from '../components/analytics/TopProducts'

export default function Analytics() {
  const { orders } = useOrders()
  const { categories } = useProducts()
  const { addToast } = useToast()

  const stats = useMemo(() => {
    let today = 0, week = 0, month = 0
    let tCount = 0, wCount = 0, mCount = 0
    for (const o of orders) {
      const d = new Date(o.createdAt)
      if (isToday(d))     { today += o.total; tCount++ }
      if (isThisWeek(d))  { week  += o.total; wCount++ }
      if (isThisMonth(d)) { month += o.total; mCount++ }
    }
    return { today, tCount, week, wCount, month, mCount }
  }, [orders])

  const handlePDF = () => {
    try {
      if (orders.length === 0) {
        addToast({ title: 'No orders to export', variant: 'warning' })
        return
      }
      exportOrdersToPDF(orders, { title: 'All Orders' })
      addToast({ title: 'PDF exported', message: `${orders.length} orders…`, variant: 'success' })
    } catch (err) {
      console.error(err)
      addToast({ title: 'Export failed', message: 'Check the console', variant: 'error' })
    }
  }

  const handleExcel = () => {
    try {
      if (orders.length === 0) {
        addToast({ title: 'No orders to export', variant: 'warning' })
        return
      }
      exportOrdersToExcel(orders)
      addToast({ title: 'Excel exported', message: `${orders.length} orders…`, variant: 'success' })
    } catch (err) {
      console.error(err)
      addToast({ title: 'Export failed', message: 'Check the console', variant: 'error' })
    }
  }

  return (
    <div className="section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] muted font-medium">Insights</p>
          <h1 className="h-title mt-1">Analytics</h1>
          <p className="muted text-sm mt-1">Revenue, categories, and your best sellers — all in one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExcel}
            className="px-4 py-2.5 rounded-xl bg-white border border-black/[0.06] text-ink text-sm font-medium hover:bg-surface active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-accent" /> Excel
          </button>
          <button
            type="button"
            onClick={handlePDF}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-premium hover:shadow-premium-lg active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Calendar}    tint="primary"   label="Today"      value={stats.today} count={stats.tCount} delay={0} />
        <StatCard icon={TrendingUp}  tint="secondary" label="This Week"  value={stats.week}  count={stats.wCount} delay={0.07} />
        <StatCard icon={ShoppingBag} tint="accent"    label="This Month" value={stats.month} count={stats.mCount} delay={0.14} />
      </div>

      {/* Revenue chart */}
      <Section title="Revenue — last 30 days" subtitle="Daily revenue trend" icon={Sparkles} delay={0.18}>
        <RevenueChart orders={orders} days={30} />
      </Section>

      {/* Two-column: category + top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <Section title="By category" subtitle="Revenue share across categories" delay={0.22}>
          <CategoryBreakdown orders={orders} categories={categories} />
        </Section>
        <Section title="Top sellers" subtitle="Best-performing products by units sold" delay={0.26}>
          <TopProducts orders={orders} limit={5} />
        </Section>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, tint, label, value, count, delay }) {
  const tints = {
    primary:   'from-primary/10 to-primary/0 text-primary',
    secondary: 'from-secondary/10 to-secondary/0 text-secondary',
    accent:    'from-accent/10 to-accent/0 text-accent',
  }
  return (
    <motion.div
      initial={ { opacity: 0, y: 14 } }
      animate={ { opacity: 1, y: 0 } }
      transition={ { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] } }
      className="relative bg-white rounded-3xl border border-black/[0.05] shadow-card p-5 overflow-hidden"
    >
      <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${tints[tint]} blur-2xl opacity-60`} />
      <div className="relative flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.08em] muted font-semibold">{label}</p>
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${tints[tint]} grid place-items-center`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="relative text-3xl font-semibold tracking-tight tabular-nums text-ink mt-2">{formatDA(value)}</p>
      <p className="relative text-xs muted mt-1 tabular-nums">{count} order{count !== 1 && 's'}</p>
    </motion.div>
  )
}

function Section({ title, subtitle, icon: Icon, children, delay = 0 }) {
  return (
    <motion.section
      initial={ { opacity: 0, y: 12 } }
      animate={ { opacity: 1, y: 0 } }
      transition={ { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] } }
      className="bg-white rounded-3xl border border-black/[0.05] shadow-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-ink tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs muted mt-0.5">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/0 grid place-items-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
      {children}
    </motion.section>
  )
}
