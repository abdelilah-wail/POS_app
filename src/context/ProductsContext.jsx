import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { DEFAULT_PRODUCTS, CATEGORIES } from '../data/defaultProducts'

const ProductsContext = createContext(null)
const KEY = 'luxury-pos:products'

export function ProductsProvider({ children }) {
  // Seeds default catalog on first load. After that, edits persist.
  const [products, setProducts] = useLocalStorage(KEY, DEFAULT_PRODUCTS)

  const byCategory = useMemo(() => {
    const map = {}
    CATEGORIES.forEach((c) => { map[c.key] = [] })
    products.forEach((p) => {
      if (!map[p.category]) map[p.category] = []
      map[p.category].push(p)
    })
    return map
  }, [products])

  const addProduct = useCallback((data) => {
    const id = data.id || `${data.category}-${Date.now()}`
    const product = { ...data, id, price: Number(data.price) || 0 }
    setProducts((prev) => [...prev, product])
    return product
  }, [setProducts])

  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) => prev.map((p) =>
      p.id === id
        ? { ...p, ...updates, price: Number(updates.price ?? p.price) || 0 }
        : p
    ))
  }, [setProducts])

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [setProducts])

  const resetToDefaults = useCallback(() => setProducts(DEFAULT_PRODUCTS), [setProducts])

  const getCategory = useCallback(
    (key) => CATEGORIES.find((c) => c.key === key) || null,
    []
  )

  const getProductsByCategory = useCallback(
    (key) => byCategory[key] || [],
    [byCategory]
  )

  const value = useMemo(() => ({
    products,
    categories: CATEGORIES,
    byCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefaults,
    getCategory,
    getProductsByCategory,
  }), [products, byCategory, addProduct, updateProduct, deleteProduct, resetToDefaults, getCategory, getProductsByCategory])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within <ProductsProvider>')
  return ctx
}
