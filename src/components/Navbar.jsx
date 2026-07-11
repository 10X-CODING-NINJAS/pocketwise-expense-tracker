import { useState } from 'react'
import { Wallet, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  const firstName = user?.email?.split('@')[0] ?? 'there'

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await signOut()
      toast.success('Signed out. See you soon!')
    } catch (err) {
      toast.error(err.message || 'Could not sign out. Try again.')
      setLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-money-600">
            <Wallet className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-ink">Pocketwise</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <p className="hidden text-sm text-ink-soft sm:block">
            Welcome back, <span className="font-medium text-ink capitalize">{firstName}</span>
          </p>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-ink-soft transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? <LoadingSpinner size="sm" /> : <LogOut className="h-4 w-4" aria-hidden="true" />}
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
