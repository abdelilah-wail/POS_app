export default function Skeleton({ className = '', rounded = 'rounded-xl' }) {
  return <div className={`shimmer ${rounded} ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  )
}
