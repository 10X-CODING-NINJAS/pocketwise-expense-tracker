import { useId, cloneElement } from 'react'
import { Wallet } from 'lucide-react'

export function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card">{children}</div>
      </div>
    </div>
  )
}

export function AuthHeader({ title, subtitle }) {
  return (
    <div className="mb-7 flex flex-col items-center text-center">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-money-600">
        <Wallet className="h-6 w-6 text-white" aria-hidden="true" />
      </div>
      <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
      <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p>
    </div>
  )
}

export function AuthField({ label, error, children }) {
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

export function authInputClass(hasError) {
  return `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-ink-muted ${
    hasError
      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
      : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
  }`
}
