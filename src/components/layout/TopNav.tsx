import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { EditorLoginDialog, RoleBadge } from '@/components/auth/EditorLoginDialog'
import { LanguageToggle } from '@/components/layout/LanguageToggle'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { useSearchOverlay } from '@/contexts/SearchContext'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: '/', key: 'discover' as const },
  { to: '/rankings', key: 'rankings' as const },
]

export function TopNav() {
  const location = useLocation()
  const { openSearch } = useSearchOverlay()
  const { isEditor, isAuthenticated, logout } = useAuth()
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

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
          {NAV_LINKS.map(({ to, key }) => {
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
                {t.nav[key]}
              </Link>
            )
          })}
        </div>
        <div className="flex items-center space-x-3 md:space-x-4 text-primary">
          <RoleBadge className="hidden sm:inline-flex" />
          <LanguageToggle />
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => logout()}
              className="text-label-sm text-muted hover:text-primary transition-colors"
            >
              {t.auth.logout}
            </button>
          )}
          {isAuthenticated && !isEditor && (
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="text-label-sm text-muted hover:text-gold transition-colors"
            >
              {t.auth.login}
            </button>
          )}
          <button
            type="button"
            onClick={openSearch}
            className="hover:opacity-80 transition-opacity"
            aria-label={t.nav.search}
          >
            <span className="material-symbols-outlined">search</span>
          </button>
          <button
            type="button"
            className="hover:opacity-80 transition-opacity hidden sm:block"
            aria-label={t.nav.notifications}
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </div>
      <EditorLoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </nav>
  )
}
