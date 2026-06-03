import { motion } from 'framer-motion'
import { GlassCard } from '../ui'
import useAnimatedCounter from '../../hooks/useAnimatedCounter'

export default function StatCard({
  icon: Icon,
  label,
  value = 0,
  formatter = (v) => v.toFixed(0),
  suffix = '',
  color = 'from-primary to-secondary',
  delay = 0,
  hint,
}) {
  const animated = useAnimatedCounter(value, 1200)

  return (
    <motion.div
      initial={ { opacity: 0, y: 18 } }
      animate={ { opacity: 1, y: 0 } }
      transition={ { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] } }
    >
      <GlassCard hover className="h-full">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] muted font-medium">{label}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl xl:text-4xl font-semibold tabular-nums tracking-tight text-ink">
                {formatter(animated)}
              </span>
              {suffix && <span className="text-sm muted">{suffix}</span>}
            </div>
            {hint && <p className="text-xs muted mt-2">{hint}</p>}
          </div>

          {Icon && (
            <div className={`shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br ${color} grid place-items-center shadow-premium`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  )
}
