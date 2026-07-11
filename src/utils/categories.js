// Single source of truth for expense categories. Every component that
// needs the list, a color, or a swatch class pulls from here so the
// palette can never drift out of sync between the filter, the form,
// and the expense cards.

export const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
]

// Hex values back the monthly-summary distribution bar (inline styles),
// while the Tailwind class pairs back badges and dots (compiled classes).
export const CATEGORY_STYLES = {
  Food: { hex: '#F59E0B', badge: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  Travel: { hex: '#0EA5E9', badge: 'bg-sky-50 text-sky-700', dot: 'bg-sky-500' },
  Shopping: { hex: '#D946EF', badge: 'bg-fuchsia-50 text-fuchsia-700', dot: 'bg-fuchsia-500' },
  Bills: { hex: '#F43F5E', badge: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500' },
  Entertainment: { hex: '#8B5CF6', badge: 'bg-violet-50 text-violet-700', dot: 'bg-violet-500' },
  Health: { hex: '#10B981', badge: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  Education: { hex: '#3B82F6', badge: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  Other: { hex: '#64748B', badge: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
}

export function categoryStyle(category) {
  return CATEGORY_STYLES[category] ?? CATEGORY_STYLES.Other
}
