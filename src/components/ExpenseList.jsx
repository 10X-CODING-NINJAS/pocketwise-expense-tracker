import { Inbox, SearchX } from 'lucide-react'
import ExpenseCard from './ExpenseCard'

export default function ExpenseList({ expenses, loading, hasAnyExpenses, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[68px] animate-pulse rounded-xl border border-slate-200 bg-slate-50" />
        ))}
      </div>
    )
  }

  if (expenses.length === 0) {
    const isFiltered = hasAnyExpenses
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white/60 py-14 text-center">
        {isFiltered ? (
          <>
            <SearchX className="h-8 w-8 text-ink-muted" aria-hidden="true" />
            <p className="font-medium text-ink">No expenses in this category</p>
            <p className="max-w-xs text-sm text-ink-muted">Try a different filter, or add a new expense here.</p>
          </>
        ) : (
          <>
            <Inbox className="h-8 w-8 text-ink-muted" aria-hidden="true" />
            <p className="font-medium text-ink">No expenses yet</p>
            <p className="max-w-xs text-sm text-ink-muted">
              Add your first expense to start tracking where your money goes.
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
