import { Loader2 } from 'lucide-react'

const SIZES = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' }

export default function Spinner({ size = 'md', className = '' }) {
  return <Loader2 className={`${SIZES[size]} text-primary animate-spin ${className}`} />
}

export function FullScreenLoader({ label = 'Loading…' }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 backdrop-blur-md animate-fade-in">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="xl" />
        <p className="text-sm muted">{label}</p>
      </div>
    </div>
  )
}
