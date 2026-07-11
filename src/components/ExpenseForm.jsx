import { useEffect, useId, useRef, useState, cloneElement } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import { CATEGORIES } from '../utils/categories'
import { validateExpense } from '../utils/validation'
import { todayISO } from '../utils/formatters'
import LoadingSpinner from './LoadingSpinner'
import { useModalEffects } from '../hooks/useModalEffects'

const EMPTY_FORM = { title: '', amount: '', category: '', date: todayISO() }

export default function ExpenseForm({ open, expense, onClose, onCreate, onUpdate }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const panelRef = useRef(null)
  const titleInputRef = useRef(null)

  const isEditing = Boolean(expense)

  useEffect(() => {
    if (!open) return
    setForm(
      expense
        ? {
            title: expense.title,
            amount: String(expense.amount),
            category: expense.category,
            date: expense.date,
          }
        : EMPTY_FORM
    )
    setErrors({})
    titleInputRef.current?.focus()
  }, [open, expense])

  useModalEffects(panelRef, { open, onClose, disabled: submitting })

  if (!open) return null

  function handleChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validateExpense(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      if (isEditing) {
        await onUpdate(expense.id, form)
        toast.success('Expense updated')
      } else {
        await onCreate(form)
        toast.success('Expense added')
      }
      onClose()
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center sm:px-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="expense-form-title"
    >
      <div ref={panelRef} className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-popover sm:rounded-2xl animate-scale-in">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="expense-form-title" className="font-display text-lg font-bold text-ink">
            {isEditing ? 'Edit expense' : 'Add expense'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="rounded-lg p-1.5 text-ink-muted transition hover:bg-slate-100 hover:text-ink disabled:opacity-50"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Field label="Title" error={errors.title}>
            <input
              ref={titleInputRef}
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Grocery run"
              maxLength={120}
              disabled={submitting}
              className={inputClass(errors.title)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Amount (₹)" error={errors.amount}>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                disabled={submitting}
                className={inputClass(errors.amount)}
              />
            </Field>

            <Field label="Date" error={errors.date}>
              <input
                type="date"
                value={form.date}
                max={todayISO()}
                onChange={(e) => handleChange('date', e.target.value)}
                disabled={submitting}
                className={inputClass(errors.date)}
              />
            </Field>
          </div>

          <Field label="Category" error={errors.category}>
            <select
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              disabled={submitting}
              className={inputClass(errors.category)}
            >
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <LoadingSpinner size="sm" />}
              {isEditing ? 'Save changes' : 'Add expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  const id = useId()
  const errorId = `${id}-error`
  const field = cloneElement(children, {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
  })

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-soft">
        {label}
      </label>
      {field}
      {error && (
        <p id={errorId} className="mt-1 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  )
}

function inputClass(hasError) {
  return `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-ink-muted ${
    hasError
      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
      : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
  }`
}
