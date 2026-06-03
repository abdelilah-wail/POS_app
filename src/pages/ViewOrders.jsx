import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, Calendar, Trash2, ChevronDown, ChevronLeft, ChevronRight,
    Package, ArrowUpDown, Filter, X,
} from 'lucide-react'
import { useOrders } from '../context/OrdersContext'
import { useProducts } from '../context/ProductsContext'
import { useToast } from '../components/ui'
import { formatDA, formatDateTime } from '../utils/format'
import { isToday, isThisWeek, isThisMonth } from '../utils/dateRange'
import DeleteOrderModal from '../components/orders/DeleteOrderModal'
import { Printer } from 'lucide-react'
import { printReceipt } from '../utils/export'
import { printDayOrders, parseLocalDate } from '../utils/dayExport'

const PAGE_SIZE = 10

const DATE_RANGES = [
    { key: 'all', label: 'All time' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This week' },
    { key: 'month', label: 'This month' },
]

const SORT_OPTIONS = [
    { key: 'newest', label: 'Newest first' },
    { key: 'oldest', label: 'Oldest first' },
    { key: 'total-desc', label: 'Highest total' },
    { key: 'total-asc', label: 'Lowest total' },
]
function todayISO() {
    const t = new Date()
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

export default function ViewOrders() {
    const { orders, deleteOrder } = useOrders()
    const { categories } = useProducts()
    const { addToast } = useToast()

    const [query, setQuery] = useState('')
    const [dateRange, setDateRange] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [sortBy, setSortBy] = useState('newest')
    const [expanded, setExpanded] = useState(null)
    const [deleting, setDeleting] = useState(null)
    const [page, setPage] = useState(1)
    const [printDate, setPrintDate] = useState(todayISO)

    const handlePrintDay = () => {
        if (!printDate) {
            addToast({ title: 'Pick a date first', variant: 'warning' })
            return
        }
        try {
            printDayOrders(orders, parseLocalDate(printDate))
            addToast({
                title: 'Daily report opened',
                message: 'Use your browser to print.',
                variant: 'success',
            })
        } catch (err) {
            if (err.code === 'EMPTY') {
                addToast({ title: 'No orders on this day', variant: 'warning' })
            } else {
                console.error(err)
                addToast({ title: 'Print failed', variant: 'error' })
            }
        }
    }

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        let list = orders.filter((o) => {
            const createdAt = new Date(o.createdAt)
            if (dateRange === 'today' && !isToday(createdAt)) return false
            if (dateRange === 'week' && !isThisWeek(createdAt)) return false
            if (dateRange === 'month' && !isThisMonth(createdAt)) return false
            if (categoryFilter !== 'all' && !o.items.some((it) => it.category === categoryFilter)) return false
            if (q) {
                const hit = o.id.toLowerCase().includes(q) || o.items.some((it) => it.name.toLowerCase().includes(q))
                if (!hit) return false
            }
            return true
        })
        list = [...list].sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
            if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
            if (sortBy === 'total-desc') return b.total - a.total
            if (sortBy === 'total-asc') return a.total - b.total
            return 0
        })
        return list
    }, [orders, query, dateRange, categoryFilter, sortBy])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const safePage = Math.min(page, totalPages)
    const paginated = useMemo(
        () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
        [filtered, safePage],
    )

    const summary = useMemo(() => {
        const total = filtered.reduce((sum, o) => sum + o.total, 0)
        const items = filtered.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0)
        return { total, count: filtered.length, items }
    }, [filtered])

    const hasActiveFilters =
        query.trim() !== '' || dateRange !== 'all' || categoryFilter !== 'all' || sortBy !== 'newest'

    const clearFilters = () => {
        setQuery(''); setDateRange('all'); setCategoryFilter('all'); setSortBy('newest'); setPage(1)
    }

    const handleConfirmDelete = () => {
        if (!deleting) return
        const order = deleting
        setDeleting(null)
        try {
            deleteOrder(order.id)
            addToast({ title: 'Order deleted', message: order.id, variant: 'success' })
        } catch (err) {
            console.error('Delete order failed', err)
        }
    }

    return (
        <div className="section">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.08em] muted font-medium">Activity</p>
                    <h1 className="h-title mt-1">Orders</h1>
                    <p className="muted text-sm mt-1">
                        {summary.count === 0 ? 'No matching orders.' : (
                            <>
                                <span className="tabular-nums font-medium text-ink">{summary.count}</span> order{summary.count !== 1 && 's'} ·{' '}
                                <span className="tabular-nums font-medium text-ink">{summary.items}</span> item{summary.items !== 1 && 's'} ·{' '}
                                <span className="tabular-nums font-medium text-ink">{formatDA(summary.total)}</span> total
                            </>
                        )}
                    </p>
                </div>
            </div>

            {/* Filter bar */}
            <div className="bg-white rounded-3xl border border-black/[0.05] shadow-card p-5 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-5 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
                            placeholder="Search by order ID or product…"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface border border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/15 outline-none text-sm transition-all"
                        />
                    </div>
                    <div className="md:col-span-3 relative">
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface border border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/15 outline-none text-sm transition-all appearance-none"
                        >
                            {SORT_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-3 relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface border border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/15 outline-none text-sm transition-all appearance-none"
                        >
                            <option value="all">All categories</option>
                            {categories.map((c) => <option key={c.key} value={c.key}>{c.emoji} {c.name}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-1 flex">
                        <button
                            type="button"
                            onClick={clearFilters}
                            disabled={!hasActiveFilters}
                            aria-label="Clear filters"
                            className="w-full px-3 py-2.5 rounded-xl bg-surface text-ink hover:bg-surface/70 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {DATE_RANGES.map((r) => (
                        <button
                            key={r.key}
                            type="button"
                            onClick={() => { setDateRange(r.key); setPage(1) }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 ${dateRange === r.key
                                ? 'bg-ink text-white shadow-premium'
                                : 'bg-surface text-ink hover:bg-surface/70'
                                }`}
                        >
                            <Calendar className="w-3.5 h-3.5" />
                            {r.label}
                        </button>
                    ))}
                </div>
                <div className="mt-4 pt-3 border-t border-black/[0.05] flex flex-wrap items-center gap-2">
                    <span className="text-xs muted mr-1 inline-flex items-center gap-1.5">
                        <Printer className="w-3.5 h-3.5" /> Print all orders for:
                    </span>
                    <input
                        type="date"
                        value={printDate}
                        onChange={(e) => setPrintDate(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-surface border border-transparent text-sm focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                    />
                    <button
                        type="button"
                        onClick={handlePrintDay}
                        className="px-4 py-2 rounded-xl bg-ink text-white text-sm font-semibold shadow-premium hover:bg-ink/90 active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <Printer className="w-4 h-4" /> Print day
                    </button>
                </div>
            </div>

            {/* Results */}
            {paginated.length === 0 ? (
                <EmptyState hasAny={orders.length > 0} hasFilters={hasActiveFilters} onClear={clearFilters} />
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block bg-white rounded-3xl border border-black/[0.05] shadow-card overflow-hidden">
                        <div className="grid grid-cols-12 px-6 py-3 border-b border-black/[0.05] bg-surface/40 text-[11px] font-semibold uppercase tracking-[0.08em] muted">
                            <div className="col-span-2">Order ID</div>
                            <div className="col-span-3">Date</div>
                            <div className="col-span-4">Items</div>
                            <div className="col-span-1 text-right">Qty</div>
                            <div className="col-span-1 text-right">Total</div>
                            <div className="col-span-1 text-right">Actions</div>
                        </div>
                        <ul className="divide-y divide-black/[0.04]">
                            <AnimatePresence initial={false}>
                                {paginated.map((order) => (
                                    <OrderRow
                                        key={order.id}
                                        order={order}
                                        expanded={expanded === order.id}
                                        onToggle={() => setExpanded((cur) => (cur === order.id ? null : order.id))}
                                        onDelete={() => setDeleting(order)}
                                        categories={categories}
                                    />
                                ))}
                            </AnimatePresence>
                        </ul>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        <AnimatePresence initial={false}>
                            {paginated.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    expanded={expanded === order.id}
                                    onToggle={() => setExpanded((cur) => (cur === order.id ? null : order.id))}
                                    onDelete={() => setDeleting(order)}
                                    categories={categories}
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {totalPages > 1 && (
                        <Pagination page={safePage} totalPages={totalPages} total={filtered.length} onChange={setPage} />
                    )}
                </>
            )}

            <DeleteOrderModal
                open={Boolean(deleting)}
                order={deleting}
                onCancel={() => setDeleting(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}

function OrderRow({ order, expanded, onToggle, onDelete, categories }) {
    const itemCount = order.items.reduce((s, i) => s + i.qty, 0)
    const summary = order.items.slice(0, 3).map((it) => `${it.emoji} ${it.name} ×${it.qty}`).join(' · ')
    const more = order.items.length > 3 ? ` +${order.items.length - 3} more` : ''
    return (
        <motion.li
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="hover:bg-surface/40 transition-colors"
        >
            <button
                type="button"
                onClick={onToggle}
                className="w-full grid grid-cols-12 px-6 py-4 items-center text-left"
            >
                <div className="col-span-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tabular-nums">
                        {order.id}
                    </span>
                </div>
                <div className="col-span-3 text-sm text-ink">{formatDateTime(order.createdAt)}</div>
                <div className="col-span-4 text-sm muted truncate">{summary}{more}</div>
                <div className="col-span-1 text-right text-sm tabular-nums">{itemCount}</div>
                <div className="col-span-1 text-right text-sm font-semibold tabular-nums text-ink">{formatDA(order.total)}</div>
                <div className="col-span-1 flex items-center justify-end gap-1">
                    <motion.span
                        animate={{ rotate: expanded ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="w-7 h-7 rounded-lg grid place-items-center text-muted"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </motion.span>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDelete() }}
                        aria-label="Delete order"
                        className="w-7 h-7 rounded-lg grid place-items-center text-muted hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </button>
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <OrderDetails order={order} categories={categories} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.li>
    )
}

function OrderCard({ order, expanded, onToggle, onDelete, categories }) {
    const itemCount = order.items.reduce((s, i) => s + i.qty, 0)
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-black/[0.05] shadow-card overflow-hidden"
        >
            <button
                type="button"
                onClick={onToggle}
                className="w-full p-4 flex items-center justify-between text-left"
            >
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tabular-nums">{order.id}</span>
                        <span className="text-xs muted">{itemCount} item{itemCount !== 1 && 's'}</span>
                    </div>
                    <p className="text-xs muted mt-1">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                    <p className="text-base font-semibold tabular-nums text-ink">{formatDA(order.total)}</p>
                    <motion.span
                        animate={{ rotate: expanded ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="inline-block mt-1 text-muted"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </motion.span>
                </div>
            </button>
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <OrderDetails order={order} categories={categories} />
                        <div className="px-4 pb-4">
                            <button
                                type="button"
                                onClick={onDelete}
                                className="w-full px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5"
                            >
                                <Trash2 className="w-4 h-4" /> Delete order
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

function OrderDetails({ order, categories }) {
    return (
        <div className="px-6 pb-5 pt-1 bg-gradient-to-b from-surface/30 to-transparent">
            <ul className="divide-y divide-black/[0.04]">
                {order.items.map((it, i) => {
                    const cat = categories.find((c) => c.key === it.category)
                    return (
                        <li key={`${it.productId}-${i}`} className="py-2.5 flex items-center gap-3">
                            <span className="text-2xl">{it.emoji}</span>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-ink truncate">{it.name}</p>
                                <p className="text-xs muted">{cat?.name || it.category} · {formatDA(it.price)} each</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs muted">×{it.qty}</p>
                                <p className="text-sm font-semibold tabular-nums text-ink">{formatDA(it.price * it.qty)}</p>
                            </div>
                        </li>
                    )
                })}
            </ul>
            <div className="mt-3 pt-3 border-t border-black/[0.05] flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); printReceipt(order) }}
                    className="px-3 py-2 rounded-xl bg-white border border-black/[0.06] text-ink text-xs font-medium hover:bg-surface active:scale-95 transition-all inline-flex items-center gap-1.5"
                >
                    <Printer className="w-3.5 h-3.5" /> Print receipt
                </button>
                <div className="text-right">
                    <p className="text-xs muted">Total</p>
                    <p className="text-base font-semibold tabular-nums text-ink">{formatDA(order.total)}</p>
                </div>
            </div>
        </div>
    )
}

function Pagination({ page, totalPages, total, onChange }) {
    const pages = pageNumbers(page, totalPages)
    return (
        <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs muted">
                Page <span className="text-ink font-semibold">{page}</span> of {totalPages} · {total} order{total !== 1 && 's'}
            </p>
            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => onChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="w-9 h-9 rounded-xl bg-white border border-black/[0.06] grid place-items-center text-ink hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {pages.map((p, i) => p === '…' ? (
                    <span key={`gap-${i}`} className="w-9 h-9 grid place-items-center muted">…</span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onChange(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-medium tabular-nums transition-all active:scale-95 ${p === page
                            ? 'bg-ink text-white shadow-premium'
                            : 'bg-white border border-black/[0.06] text-ink hover:bg-surface'
                            }`}
                    >
                        {p}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={() => onChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="w-9 h-9 rounded-xl bg-white border border-black/[0.06] grid place-items-center text-ink hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

function pageNumbers(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const set = new Set([1, 2, total - 1, total, current - 1, current, current + 1])
    const pages = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
    const out = []
    for (let i = 0; i < pages.length; i++) {
        if (i > 0 && pages[i] - pages[i - 1] > 1) out.push('…')
        out.push(pages[i])
    }
    return out
}

function EmptyState({ hasAny, hasFilters, onClear }) {
    return (
        <div className="p-14 rounded-3xl bg-white border border-dashed border-black/[0.08] text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface mx-auto grid place-items-center mb-4">
                <Package className="w-6 h-6 text-muted" />
            </div>
            <p className="text-base font-semibold text-ink">
                {hasAny ? 'No orders match your filters' : 'No orders yet'}
            </p>
            <p className="text-sm muted mt-1">
                {hasAny
                    ? 'Try clearing the search or date range.'
                    : 'Once you complete your first order, it will show up here.'}
            </p>
            {hasFilters && (
                <button
                    type="button"
                    onClick={onClear}
                    className="mt-5 px-4 py-2.5 rounded-xl bg-ink text-white text-sm font-semibold shadow-premium hover:bg-ink/90 hover:shadow-premium-lg active:scale-[0.98] transition-all inline-flex items-center gap-2"
                >
                    <X className="w-4 h-4" /> Clear filters
                </button>
            )}
        </div>
    )
}
