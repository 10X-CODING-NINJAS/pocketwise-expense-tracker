import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useExpenses } from '../hooks/useExpenses'
import Navbar from '../components/Navbar'
import MonthlySummary from '../components/MonthlySummary'
import CategoryFilter from '../components/CategoryFilter'
import ExpenseList from '../components/ExpenseList'
import ExpenseForm from '../components/ExpenseForm'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Dashboard() {
  const { user } = useAuth()
  const { expenses, loading, error, addExpense, updateExpense, deleteExpense, refetch } = useExpenses(user?.id)

  const [categoryFilter, setCategoryFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const filteredExpenses = useMemo(() => {
    if (categoryFilter === 'All') return expenses
    return expenses.filter((e) => e.category === categoryFilter)
  }, [expenses, categoryFilter])

  function openAddForm() {
    setEditingExpense(null)
    setFormOpen(true)
  }

  function openEditForm(expense) {
    setEditingExpense(expense)
    setFormOpen(true)
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteExpense(pendingDelete.id)
      toast.success('Expense deleted')
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message || 'Could not delete this expense.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <MonthlySummary expenses={expenses} />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-money-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-money-700 sm:shrink-0"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add expense
          </button>
        </div>

        <div className="mt-5">
          {error ? (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between">
              <span>Couldn't load your expenses: {error}</span>
              <button
                type="button"
                onClick={refetch}
                className="shrink-0 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Try again
              </button>
            </div>
          ) : (
            <ExpenseList
              expenses={filteredExpenses}
              loading={loading}
              hasAnyExpenses={expenses.length > 0}
              onEdit={openEditForm}
              onDelete={setPendingDelete}
            />
          )}
        </div>
      </main>

      <ExpenseForm
        open={formOpen}
        expense={editingExpense}
        onClose={() => setFormOpen(false)}
        onCreate={addExpense}
        onUpdate={updateExpense}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this expense?"
        description={
          pendingDelete ? `"${pendingDelete.title}" will be permanently removed. This can't be undone.` : ''
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
