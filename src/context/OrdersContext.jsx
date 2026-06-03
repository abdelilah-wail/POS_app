import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const OrdersContext = createContext(null)
const ORDERS_KEY = 'luxury-pos:orders'

// Helper to compute totals & counts
function getStats(orders) {
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)

  let total = 0
  let todayTotal = 0
  let todayCount = 0

  for (const o of orders) {
    const t = Number(o.total) || 0
    total += t
    const d = new Date(o.createdAt)
    if (d >= todayStart) {
      todayTotal += t
      todayCount += 1
    }
  }

  return {
    totalRevenue: total,
    todayRevenue: todayTotal,
    totalOrders: orders.length,
    todayOrders: todayCount,
  }
}

function makeOrderId(orders) {
  // ORD-0001 sequential, regardless of deletions, so IDs stay unique
  const max = orders.reduce((m, o) => {
    const n = Number(String(o.id || '').replace(/[^0-9]/g, ''))
    return Number.isFinite(n) && n > m ? n : m
  }, 0)
  return `ORD-${String(max + 1).padStart(4, '0')}`
}
// Reuse the same logic as makeOrderId but as a callable helper
function peekNextOrderId(orders) {
  const max = orders.reduce((m, o) => {
    const n = Number(String(o.id || '').replace(/[^0-9]/g, ''))
    return Number.isFinite(n) && n > m ? n : m
  }, 0)
  return `ORD-${String(max + 1).padStart(4, '0')}`
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useLocalStorage(ORDERS_KEY, [])

  const addOrder = useCallback((items, opts = {}) => {
    const safeItems = (items || []).filter((i) => i && i.qty > 0)
    const total = safeItems.reduce((s, i) => s + i.qty * Number(i.price || 0), 0)

    const order = {
      id: makeOrderId(orders),
      items: safeItems.map((i) => ({
        productId: i.productId || i.id,
        name: i.name,
        category: i.category || null,
        price: Number(i.price) || 0,
        qty: Number(i.qty) || 0,
        subtotal: (Number(i.price) || 0) * (Number(i.qty) || 0),
      })),
      total,
      createdAt: new Date().toISOString(),
      ...opts,
    }

    setOrders((prev) => [order, ...prev])
    return order
  }, [orders, setOrders])

  const deleteOrder = useCallback((id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }, [setOrders])

  const clearOrders = useCallback(() => setOrders([]), [setOrders])
  const getNextOrderId = useCallback(() => peekNextOrderId(orders), [orders])

  const stats = useMemo(() => getStats(orders), [orders])

  const value = useMemo(() => ({
  orders,
  stats,
  addOrder,
  deleteOrder,
  clearOrders,
  getNextOrderId,
}), [orders, stats, addOrder, deleteOrder, clearOrders, getNextOrderId])

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within <OrdersProvider>')
  return ctx
}
