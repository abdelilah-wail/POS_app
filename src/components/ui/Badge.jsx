const VARIANTS = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-accent/10 text-accent-dark',
  warning: 'bg-yellow-100 text-yellow-700',
  danger:  'bg-red-100 text-red-600',
  neutral: 'bg-surface text-ink',
}

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${VARIANTS[variant]} ${className}`}>
      {children}
    </span>
  )
}
