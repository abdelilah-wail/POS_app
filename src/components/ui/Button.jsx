import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'btn-danger',
}

const SIZES = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
  xl: 'px-9 py-4 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  fullWidth = false,
  className = '',
  ...props
}) {
  const variantCls = VARIANTS[variant] || VARIANTS.primary
  const sizeCls = SIZES[size] || SIZES.md
  const widthCls = fullWidth ? 'w-full' : ''
  const disabledCls = (disabled || loading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''

  return (
    <button
      disabled={disabled || loading}
      className={`${variantCls} ${sizeCls} ${widthCls} ${disabledCls} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      <span>{children}</span>
      {!loading && IconRight && <IconRight className="w-4 h-4" />}
    </button>
  )
}
