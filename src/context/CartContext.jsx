import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const CartContext = createContext(null)
const KEY = 'luxury-pos:cart'

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage(KEY, [])

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: Number(product.price) || 0,
          category: product.category,
          emoji: product.emoji || '🛍️',
          qty,
        },
      ]
    })
  }, [setItems])

  const increment = useCallback((productId) => {
    setItems((prev) => prev.map((i) =>
      i.productId === productId ? { ...i, qty: i.qty + 1 } : i
    ))
  }, [setItems])

  const decrement = useCallback((productId) => {
    setItems((prev) => {
      const item = prev.find((i) => i.productId === productId)
      if (!item) return prev
      if (item.qty <= 1) return prev.filter((i) => i.productId !== productId)
      return prev.map((i) =>
        i.productId === productId ? { ...i, qty: i.qty - 1 } : i
      )
    })
  }, [setItems])

  const setQty = useCallback((productId, qty) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.productId !== productId)
      return prev.map((i) =>
        i.productId === productId ? { ...i, qty } : i
      )
    })
  }, [setItems])

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [setItems])

  const clear = useCallback(() => setItems([]), [setItems])

  const getQty = useCallback(
    (productId) => items.find((i) => i.productId === productId)?.qty || 0,
    [items]
  )

  const total = useMemo(
    () => items.reduce((s, i) => s + i.qty * (Number(i.price) || 0), 0),
    [items]
  )

  const count = useMemo(
    () => items.reduce((s, i) => s + i.qty, 0),
    [items]
  )

  const value = useMemo(() => ({
    items, total, count,
    addItem, increment, decrement, setQty, removeItem, clear, getQty,
  }), [items, total, count, addItem, increment, decrement, setQty, removeItem, clear, getQty])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within <CartProvider>')
  return ctx
}
