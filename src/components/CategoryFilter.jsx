import { CATEGORIES, categoryStyle } from '../utils/categories'

export default function CategoryFilter({ value, onChange }) {
  const options = ['All', ...CATEGORIES]

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin sm:flex-wrap sm:overflow-visible">
      {options.map((option) => {
        const isActive = value === option
        const dotClass = option === 'All' ? 'bg-brand-600' : categoryStyle(option).dot

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={isActive}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              isActive
                ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                : 'border-slate-200 bg-white text-ink-soft hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-white' : dotClass}`} aria-hidden="true" />
            {option}
          </button>
        )
      })}
    </div>
  )
}
