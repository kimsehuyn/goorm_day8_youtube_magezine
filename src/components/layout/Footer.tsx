import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LanguageContext'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant w-full pt-24 pb-12 mt-24 lg:ml-64">
      <div className="max-w-content-width mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div className="col-span-1 md:col-span-2 mb-12 md:mb-0">
          <div className="font-display text-display-xl text-primary mb-6">YTMAG AI</div>
          <p className="font-body text-body-md text-muted max-w-sm">
            © 2026 YTMAG AI. {t.footer.tagline}
          </p>
        </div>
        <div>
          <h5 className="text-label-md text-primary mb-4 uppercase tracking-widest">{t.footer.platform}</h5>
          <ul className="space-y-3">
            <li><Link to="/" className="text-body-md text-muted hover:text-gold transition-colors">{t.footer.about}</Link></li>
            <li><span className="text-body-md text-muted">{t.footer.careers}</span></li>
            <li><span className="text-body-md text-muted">{t.footer.api}</span></li>
          </ul>
        </div>
        <div>
          <h5 className="text-label-md text-primary mb-4 uppercase tracking-widest">{t.footer.legal}</h5>
          <ul className="space-y-3">
            <li><span className="text-body-md text-muted">{t.footer.privacy}</span></li>
            <li><span className="text-body-md text-muted">{t.footer.terms}</span></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
