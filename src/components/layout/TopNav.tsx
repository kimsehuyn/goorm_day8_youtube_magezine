import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useSearchOverlay } from '@/contexts/SearchContext'

const NAV_LINKS = [
  { to: '/', label: 'Discover' },
  { to: '/rankings', label: 'Rankings' },
] as const

export function TopNav() {
  const location = useLocation()
  const { openSearch } = useSearchOverlay()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 glass-nav transition-all duration-300 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30',
        scrolled && 'scrolled shadow-sm',
      )}
      id="main-nav"
    >
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
        <Link to="/" className="font-display text-display-lg tracking-tighter text-primary">
          YTMAG AI
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map(({ to, label }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'text-label-md uppercase tracking-wider transition-all duration-300',
                  active
                    ? 'text-primary font-bold border-b-2 border-gold pb-1'
                    : 'text-muted hover:text-primary',
                )}
              >
                {label}
              </Link>
            )
          })}
        </div>
        <div className="flex items-center space-x-4 text-primary">
          <button
            type="button"
            onClick={openSearch}
            className="hover:opacity-80 transition-opacity"
            aria-label="Search"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
          <button type="button" className="hover:opacity-80 transition-opacity" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
