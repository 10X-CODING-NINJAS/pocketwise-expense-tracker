import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, MailCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { validateEmail, validatePassword } from '../utils/validation'
import { mapAuthError } from '../utils/authErrors'
import { AuthLayout, AuthHeader, AuthField, authInputClass } from '../components/AuthLayout'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: password !== confirmPassword ? 'Passwords do not match.' : null,
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setSubmitting(true)
    try {
      const data = await signUp(email.trim(), password)

      // If email confirmation is enabled on the Supabase project, a new
      // sign-up comes back with a user but no session — show a clear
      // next step instead of silently doing nothing.
      if (data.user && !data.session) {
        setConfirmationSent(true)
      } else {
        toast.success('Account created!')
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      toast.error(mapAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmationSent) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center py-2 text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-money-50">
            <MailCheck className="h-6 w-6 text-money-600" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Check your inbox</h1>
          <p className="mt-2 text-sm text-ink-soft">
            We sent a confirmation link to <span className="font-medium text-ink">{email}</span>. Confirm your
            address, then log in to start tracking expenses.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Back to log in
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <AuthHeader title="Create your account" subtitle="Start tracking your everyday spending in minutes." />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthField label="Email address" error={errors.email}>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={submitting}
            className={authInputClass(errors.email)}
          />
        </AuthField>

        <AuthField label="Password" error={errors.password}>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              disabled={submitting}
              className={`${authInputClass(errors.password)} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-soft"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </AuthField>

        <AuthField label="Confirm password" error={errors.confirmPassword}>
          <input
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            disabled={submitting}
            className={authInputClass(errors.confirmPassword)}
          />
        </AuthField>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && <LoadingSpinner size="sm" />}
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
