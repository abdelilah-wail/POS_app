import { useEffect, useRef, useState } from 'react'

// Apple-style easeOutExpo
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

export default function useAnimatedCounter(target = 0, duration = 1000) {
  const [value, setValue] = useState(0)
  const fromRef = useRef(0)
  const startRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    fromRef.current = value
    startRef.current = performance.now()
    const to = Number(target) || 0

    const tick = (now) => {
      const elapsed = now - startRef.current
      const t = Math.min(1, elapsed / duration)
      const eased = easeOutExpo(t)
      const next = fromRef.current + (to - fromRef.current) * eased
      setValue(next)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else setValue(to)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  return value
}
