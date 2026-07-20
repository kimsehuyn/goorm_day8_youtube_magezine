import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const SIDE_LINKS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/rankings', label: 'Trending', icon: 'trending_up' },
] as const

export function SideNav() {
  const location = useLocation()

  return (
    <aside className="hidden lg:flex flex-col border-r border-outline-variant h-screen w-64 fixed left-0 top-0 bg-background z-40 pt-24 pb-8 justify-between">
      <div className="px-4">
        <div className="mb-8 px-4">
          <h2 className="font-display text-headline-lg text-gold mb-1">YTMAG</h2>
          <p className="text-label-sm text-muted uppercase tracking-widest">AI Editorial</p>
        </div>
        <nav className="space-y-2">
          {SIDE_LINKS.map(({ to, label, icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-label-md',
                  active
                    ? 'bg-primary-container text-on-primary-container scale-[0.98]'
                    : 'text-on-surface-variant hover:bg-surface-container',
                )}
              >
                <span className={cn('material-symbols-outlined', active && 'material-symbols-filled')}>
                  {icon}
                </span>
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="px-8">
        <button
          type="button"
          className="w-full py-3 bg-primary text-on-primary text-label-md rounded-lg hover:scale-[1.02] transition-transform shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
        >
          Subscribe Now
        </button>
      </div>
    </aside>
  )
}
