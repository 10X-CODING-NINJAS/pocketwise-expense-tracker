import { Pencil, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate } from '../utils/formatters'
import { categoryStyle } from '../utils/categories'

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const style = categoryStyle(expense.category)

  return (
    <div className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-card">
      <div className="flex min-w-0 items-center gap-3.5">
        <span
          className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold sm:flex ${style.badge}`}
          aria-hidden="true"
        >
          {expense.category.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{expense.title}</p>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-muted">
            <span className={`rounded-full px-2 py-0.5 font-medium ${style.badge}`}>{expense.category}</span>
            <span>{formatDate(expense.date)}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        <p className="font-display text-base font-semibold tabular-nums text-ink sm:text-lg">
          {formatCurrency(expense.amount)}
        </p>
        <div className="flex items-center opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(expense)}
            aria-label={`Edit ${expense.title}`}
            className="rounded-lg p-2 text-ink-muted transition hover:bg-slate-100 hover:text-brand-600"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(expense)}
            aria-label={`Delete ${expense.title}`}
            className="rounded-lg p-2 text-ink-muted transition hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
