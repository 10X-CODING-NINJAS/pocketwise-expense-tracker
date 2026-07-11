import { CATEGORIES } from './categories'

/**
 * Validates expense form fields.
 * Returns an object keyed by field name; a field is only present if it
 * has an error, so `Object.keys(errors).length === 0` means the form
 * is valid.
 */
export function validateExpense({ title, amount, category, date }) {
  const errors = {}

  if (!title || !title.trim()) {
    errors.title = 'Give this expense a title.'
  } else if (title.trim().length > 120) {
    errors.title = 'Keep the title under 120 characters.'
  }

  if (amount === '' || amount === null || amount === undefined) {
    errors.amount = 'Enter an amount.'
  } else if (Number.isNaN(Number(amount))) {
    errors.amount = 'Amount must be a number.'
  } else if (Number(amount) <= 0) {
    errors.amount = 'Amount must be greater than 0.'
  } else if (Number(amount) > 100000000) {
    errors.amount = 'That amount looks too large. Double-check it.'
  }

  if (!category || !CATEGORIES.includes(category)) {
    errors.category = 'Choose a category.'
  }

  if (!date) {
    errors.date = 'Pick a date.'
  }

  return errors
}

export function validateEmail(email) {
  if (!email || !email.trim()) return 'Enter your email address.'
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!pattern.test(email.trim())) return 'Enter a valid email address.'
  return null
}

export function validatePassword(password) {
  if (!password) return 'Enter a password.'
  if (password.length < 6) return 'Password must be at least 6 characters.'
  return null
}
