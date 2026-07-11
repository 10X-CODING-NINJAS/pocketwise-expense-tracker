import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FullPageLoader } from './LoadingSpinner'

export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return <FullPageLoader label="Checking your session…" />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

/**
 * Inverse of ProtectedRoute: keeps already-signed-in users off the
 * login/signup screens (e.g. hitting the back button after auth, or typing
 * the URL directly) and sends them straight to the dashboard instead.
 */
export function GuestRoute({ children }) {
  const { user, initializing } = useAuth()

  if (initializing) {
    return <FullPageLoader label="Checking your session…" />
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
