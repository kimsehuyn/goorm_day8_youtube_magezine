import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage()

  return (
    <div
      className="flex items-center rounded-full border border-border bg-surface-container-lowest p-0.5"
      role="group"
      aria-label={t.language.toggleLabel}
    >
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={cn(
          'px-3 py-1.5 rounded-full text-label-sm font-semibold transition-all duration-200',
          locale === 'en'
            ? 'bg-primary text-on-primary shadow-sm'
            : 'text-muted hover:text-primary',
        )}
        aria-pressed={locale === 'en'}
      >
        {t.language.en}
      </button>
      <button
        type="button"
        onClick={() => setLocale('ko')}
        className={cn(
          'px-3 py-1.5 rounded-full text-label-sm font-semibold transition-all duration-200',
          locale === 'ko'
            ? 'bg-primary text-on-primary shadow-sm'
            : 'text-muted hover:text-primary',
        )}
        aria-pressed={locale === 'ko'}
      >
        {t.language.ko}
      </button>
    </div>
  )
}
