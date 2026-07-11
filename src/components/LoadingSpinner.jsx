import { Loader2 } from 'lucide-react'

const SIZES = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-8 h-8',
}

export default function LoadingSpinner({ size = 'md', className = '' }) {
  return <Loader2 className={`animate-spin ${SIZES[size]} ${className}`} aria-hidden="true" />
}

export function FullPageLoader({ label = 'Loading…' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-canvas">
      <LoadingSpinner size="lg" className="text-brand-600" />
      <p className="text-sm text-ink-soft">{label}</p>
    </div>
  )
}
