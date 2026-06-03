const startOfDay = (d) => {
  const x = new Date(d); x.setHours(0, 0, 0, 0); return x
}
const endOfDay = (d) => {
  const x = new Date(d); x.setHours(23, 59, 59, 999); return x
}

export const isToday = (input) => {
  const d = new Date(input)
  const now = new Date()
  return d >= startOfDay(now) && d <= endOfDay(now)
}

export const isThisWeek = (input) => {
  const d = new Date(input)
  const now = new Date()
  const day = now.getDay() === 0 ? 6 : now.getDay() - 1 // Monday as first
  const start = startOfDay(new Date(now))
  start.setDate(now.getDate() - day)
  const end = endOfDay(new Date(start))
  end.setDate(start.getDate() + 6)
  return d >= start && d <= end
}

export const isThisMonth = (input) => {
  const d = new Date(input)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
}
