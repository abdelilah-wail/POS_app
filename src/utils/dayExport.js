import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatDA } from './format'

const BRAND = 'Elwael Ecomerce'
const PRIMARY = [10, 132, 255]
const SURFACE  = [245, 245, 247]

// Parse 'YYYY-MM-DD' as LOCAL date (avoids UTC shift bug)
export function parseLocalDate(str) {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatLong(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function getOrdersForDay(orders, date) {
  if (!date) return []
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return orders
    .filter((o) => {
      const t = new Date(o.createdAt).getTime()
      return t >= start.getTime() && t < end.getTime()
    })
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
}

export function printDayOrders(orders, date) {
  const dayOrders = getOrdersForDay(orders, date)
  if (dayOrders.length === 0) {
    const err = new Error('No orders for this day')
    err.code = 'EMPTY'
    throw err
  }

  const doc = new jsPDF()
  const dateLabel = formatLong(date)

  // Header band
  doc.setFillColor(...PRIMARY)
  doc.rect(0, 0, 210, 34, 'F')
  doc.setTextColor(255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(BRAND, 14, 14)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text('Daily Orders Report', 14, 22)
  doc.setFontSize(9)
  doc.text(dateLabel, 14, 28)

  // Summary line
  const totalRev = dayOrders.reduce((s, o) => s + o.total, 0)
  const totalItems = dayOrders.reduce(
    (s, o) => s + o.items.reduce((x, it) => x + it.qty, 0),
    0,
  )
  doc.setTextColor(30)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Summary', 14, 44)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(
    `${dayOrders.length} orders · ${totalItems} items · ${formatDA(totalRev)} total revenue`,
    14,
    50,
  )

  // Product breakdown table
  const productMap = new Map()
  for (const o of dayOrders) {
    for (const it of o.items) {
      const existing = productMap.get(it.productId) || {
        name: it.name, emoji: it.emoji, qty: 0, revenue: 0,
      }
      existing.qty += it.qty
      existing.revenue += it.price * it.qty
      productMap.set(it.productId, existing)
    }
  }
  const productBreakdown = [...productMap.values()].sort((a, b) => b.qty - a.qty)

  autoTable(doc, {
    startY: 56,
    head: [['Product', 'Units sold', 'Revenue (DA)']],
    body: productBreakdown.map((p) => [
      `${p.emoji} ${p.name}`,
      p.qty,
      formatDA(p.revenue),
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: PRIMARY, textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: SURFACE },
    columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
    margin: { left: 14, right: 14 },
  })

  // Orders detail table
  const nextY = doc.lastAutoTable.finalY + 10
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(30)
  doc.text('Orders detail', 14, nextY)

  autoTable(doc, {
    startY: nextY + 4,
    head: [['Order ID', 'Time', 'Items', 'Qty', 'Total (DA)']],
    body: dayOrders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      o.items.map((it) => `${it.name} ×${it.qty}`).join(', '),
      o.items.reduce((s, it) => s + it.qty, 0),
      formatDA(o.total),
    ]),
    styles: { fontSize: 9, cellPadding: 3, overflow: 'linebreak' },
    headStyles: { fillColor: PRIMARY, textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: SURFACE },
    columnStyles: {
      0: { cellWidth: 24 },
      3: { halign: 'right', cellWidth: 14 },
      4: { halign: 'right', cellWidth: 28 },
    },
  })

  // Open in new tab → user prints from browser PDF viewer
  const blob = doc.output('blob')
  const url = URL.createObjectURL(blob)
  const w = window.open(url, '_blank')
  if (!w) {
    // Popup blocked → fallback to download
    const stamp = date.toISOString().slice(0, 10)
    doc.save(`daily_orders_${stamp}.pdf`)
  }
}
