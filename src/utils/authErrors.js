/**
 * Translates raw Supabase auth errors into short, user-friendly copy.
 * Falls back to the original message for anything we don't recognize
 * so real problems are never silently swallowed.
 */
export function mapAuthError(err) {
  const message = err?.message || ''

  if (/invalid login credentials/i.test(message)) {
    return 'Incorrect email or password.'
  }
  if (/email not confirmed/i.test(message)) {
    return 'Please confirm your email before logging in.'
  }
  if (/user already registered/i.test(message)) {
    return 'An account with this email already exists.'
  }
  if (/password should be at least/i.test(message)) {
    return message
  }
  if (/network/i.test(message) || /fetch/i.test(message)) {
    return 'Network error. Check your connection and try again.'
  }

  return message || 'Something went wrong. Please try again.'
}
