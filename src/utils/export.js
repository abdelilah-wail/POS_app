import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { formatDA, formatDateTime } from './format'

const BRAND = 'Elwael Ecomerce'
const PRIMARY = [10, 132, 255] // #0A84FF
const SURFACE  = [245, 245, 247]

function stamp() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`
}

export function exportOrdersToPDF(orders, opts = {}) {
  const doc = new jsPDF()
  const title = opts.title || 'Orders Report'

  // Header band
  doc.setFillColor(...PRIMARY)
  doc.rect(0, 0, 210, 28, 'F')
  doc.setTextColor(255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(BRAND, 14, 14)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(title, 14, 22)

  // Meta
  doc.setTextColor(120)
  doc.setFontSize(9)
  doc.text(`Generated ${new Date().toLocaleString()}`, 14, 36)

  // Summary
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
  const totalItems = orders.reduce((s, o) => s + o.items.reduce((x, it) => x + it.qty, 0), 0)
  doc.setTextColor(30)
  doc.setFontSize(10)
  doc.text(`${orders.length} orders · ${totalItems} items · ${formatDA(totalRevenue)} total`, 14, 44)

  // Table
  autoTable(doc, {
    startY: 50,
    head: [['Order ID', 'Date', 'Items', 'Qty', 'Total (DA)']],
    body: orders.map((o) => [
      o.id,
      formatDateTime(o.createdAt),
      o.items.map((it) => `${it.name} ×${it.qty}`).join(', '),
      o.items.reduce((s, it) => s + it.qty, 0),
      formatDA(o.total),
    ]),
    styles: { fontSize: 9, cellPadding: 3, overflow: 'linebreak' },
    headStyles: { fillColor: PRIMARY, textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: SURFACE },
    columnStyles: {
      4: { halign: 'right', cellWidth: 28 },
      3: { halign: 'right', cellWidth: 14 },
      0: { cellWidth: 24 },
    },
  })

  doc.save(opts.filename || `orders_${stamp()}.pdf`)
}

export function exportOrdersToExcel(orders, opts = {}) {
  const summary = orders.map((o) => ({
    'Order ID': o.id,
    'Date': formatDateTime(o.createdAt),
    'Items': o.items.reduce((s, it) => s + it.qty, 0),
    'Total (DA)': o.total,
  }))
  const lineItems = orders.flatMap((o) =>
    o.items.map((it) => ({
      'Order ID': o.id,
      'Date': formatDateTime(o.createdAt),
      'Product': it.name,
      'Category': it.category,
      'Unit Price (DA)': it.price,
      'Qty': it.qty,
      'Line Total (DA)': it.price * it.qty,
    })),
  )

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Orders')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(lineItems), 'Line Items')
  XLSX.writeFile(wb, opts.filename || `orders_${stamp()}.xlsx`)
}

export function printReceipt(order) {
  // 80mm thermal-receipt-style PDF
  const doc = new jsPDF({ unit: 'mm', format: [80, 220] })
  let y = 10

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(BRAND, 40, y, { align: 'center' })
  y += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(120)
  doc.text('Premium POS Receipt', 40, y, { align: 'center' })
  y += 6

  doc.setTextColor(0)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(`Order: ${order.id}`, 4, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.text(formatDateTime(order.createdAt), 4, y)
  y += 5

  doc.setDrawColor(220)
  doc.line(4, y, 76, y)
  y += 4

  doc.setFontSize(9)
  order.items.forEach((it) => {
    const lineTotal = it.price * it.qty
    doc.setFont('helvetica', 'bold')
    doc.text(it.name.slice(0, 30), 4, y)
    y += 3.8
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(110)
    doc.text(`${it.qty} × ${formatDA(it.price)}`, 4, y)
    doc.setTextColor(0)
    doc.text(formatDA(lineTotal), 76, y, { align: 'right' })
    y += 5
  })

  doc.setDrawColor(220)
  doc.line(4, y, 76, y)
  y += 5

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Total', 4, y)
  doc.text(formatDA(order.total), 76, y, { align: 'right' })
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(140)
  doc.text('Thank you for your purchase!', 40, y, { align: 'center' })

  // Open in a new tab; the browser shows the PDF with its print button
  const blob = doc.output('blob')
  const url = URL.createObjectURL(blob)
  const w = window.open(url, '_blank')
  if (!w) {
    // Popup blocked → fallback to download
    doc.save(`receipt_${order.id}.pdf`)
  }
}
