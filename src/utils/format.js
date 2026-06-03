export const formatDA = (value) => {
  const n = Number(value) || 0
  return `${n.toLocaleString('en-US', { maximumFractionDigits: 0 })} DA`
}

export const formatDate = (input, opts = {}) => {
  const d = input instanceof Date ? input : new Date(input)
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  })
}

export const formatTime = (input) => {
  const d = input instanceof Date ? input : new Date(input)
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export const formatDateTime = (input) =>
  `${formatDate(input)} · ${formatTime(input)}`

export const greeting = (date = new Date()) => {
  const h = date.getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
