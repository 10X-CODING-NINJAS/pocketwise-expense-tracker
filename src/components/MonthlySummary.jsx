import { useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import { formatCurrency, currentMonthLabel, isInCurrentMonth } from '../utils/formatters'
import { categoryStyle } from '../utils/categories'

export default function MonthlySummary({ expenses }) {
  const { total, breakdown, count } = useMemo(() => {
    const monthExpenses = expenses.filter((e) => isInCurrentMonth(e.date))
    const totals = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

    const byCategory = monthExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
      return acc
    }, {})

    const parts = Object.entries(byCategory)
      .map(([category, amount]) => ({
        category,
        amount,
        percent: totals > 0 ? (amount / totals) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)

    return { total: totals, breakdown: parts, count: monthExpenses.length }
  }, [expenses])

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-brand-100 to-money-100 opacity-60 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium text-ink-soft">
            <TrendingUp className="h-4 w-4 text-money-600" aria-hidden="true" />
            Spending in {currentMonthLabel()}
          </p>
          <p className="mt-2 font-display text-4xl font-extrabold tabular-nums text-ink sm:text-5xl">
            {formatCurrency(total)}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {count === 0 ? 'No expenses logged yet this month' : `across ${count} expense${count === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      {breakdown.length > 0 && (
        <div className="relative mt-6">
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            {breakdown.map(({ category, percent }) => (
              <div
                key={category}
                style={{ width: `${percent}%`, backgroundColor: categoryStyle(category).hex }}
                className="h-full first:rounded-l-full last:rounded-r-full"
                title={`${category}: ${percent.toFixed(0)}%`}
              />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {breakdown.map(({ category, amount, percent }) => (
              <div key={category} className="flex items-center gap-1.5 text-xs text-ink-soft">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: categoryStyle(category).hex }}
                  aria-hidden="true"
                />
                <span className="font-medium text-ink">{category}</span>
                <span className="text-ink-muted">
                  {formatCurrency(amount, { whole: true })} · {percent.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
