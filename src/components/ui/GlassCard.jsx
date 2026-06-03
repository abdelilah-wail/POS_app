import { motion } from 'framer-motion'

export default function GlassCard({
  children,
  className = '',
  strong = false,
  hover = false,
  as: Tag = 'div',
  ...props
}) {
  const base = strong ? 'glass-strong' : 'glass'
  const hoverCls = hover ? 'transition-all duration-500 ease-apple hover:-translate-y-1 hover:shadow-premium-lg' : ''
  const MotionTag = motion[Tag] || motion.div

  return (
    <MotionTag
      initial={ { opacity: 0, y: 12 } }
      animate={ { opacity: 1, y: 0 } }
      transition={ { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
      className={`${base} rounded-3xl p-6 ${hoverCls} ${className}`}
      {...props}
    >
      {children}
    </MotionTag>
  )
}
