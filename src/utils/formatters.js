const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

const inrFormatterWhole = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/**
 * Formats a number as Indian Rupees, e.g. 125000.5 -> "₹1,25,000.50"
 */
export function formatCurrency(amount, { whole = false } = {}) {
  const value = Number(amount) || 0
  return whole ? inrFormatterWhole.format(value) : inrFormatter.format(value)
}

/**
 * Formats an ISO date string ("2026-07-10") for display, e.g. "10 Jul 2026"
 */
export function formatDate(isoDate) {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Returns today's date as an ISO string in the browser's local time zone
 * (avoids the classic UTC off-by-one-day bug from `new Date().toISOString()`).
 */
export function todayISO() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const local = new Date(now.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 10)
}

/**
 * True if the given ISO date falls in the current calendar month/year.
 */
export function isInCurrentMonth(isoDate) {
  if (!isoDate) return false
  const [year, month] = isoDate.split('-').map(Number)
  const now = new Date()
  return year === now.getFullYear() && month === now.getMonth() + 1
}

export function currentMonthLabel() {
  return new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}
