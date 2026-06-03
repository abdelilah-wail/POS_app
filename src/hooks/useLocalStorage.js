import { useEffect, useState, useCallback } from 'react'

export default function useLocalStorage(key, initialValue) {
  const read = () => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) return typeof initialValue === 'function' ? initialValue() : initialValue
      return JSON.parse(raw)
    } catch {
      return typeof initialValue === 'function' ? initialValue() : initialValue
    }
  }

  const [value, setValue] = useState(read)

  const set = useCallback((next) => {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved))
      } catch {}
      return resolved
    })
  }, [key])

  const remove = useCallback(() => {
    try { window.localStorage.removeItem(key) } catch {}
    setValue(typeof initialValue === 'function' ? initialValue() : initialValue)
  }, [key, initialValue])

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === key) setValue(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return [value, set, remove]
}
