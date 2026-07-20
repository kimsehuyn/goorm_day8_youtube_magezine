import { useTranslation } from '@/contexts/LanguageContext'
import { translateCategory } from '@/i18n/locales'
import { formatNumber } from '@/lib/utils'
import type { RankingItem } from '@/types'
import { cn } from '@/lib/utils'

interface RankingCardProps {
  item: RankingItem
  className?: string
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  return (
    <div className="w-24 h-12 relative flex items-end gap-1">
      {data.map((value, index) => (
        <div
          key={index}
          className={cn(
            'w-1/6 rounded-t-sm',
            index === data.length - 1 ? 'bg-gold shadow-[0_0_10px_rgba(227,179,65,0.4)]' : 'bg-surface-container-highest',
          )}
          style={{ height: `${(value / max) * 100}%` }}
        />
      ))}
    </div>
  )
}

export function RankingCard({ item, className }: RankingCardProps) {
  const { t, locale } = useTranslation()
  const isTop = item.rank === 1
  const rankDisplay = item.rank.toString().padStart(2, '0')
  const growthPositive = item.growthPercent >= 0

  return (
    <article
      className={cn(
        'bg-surface rounded-xl border border-border/50 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300',
        isTop ? 'p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)]' : 'p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)]',
        className,
      )}
    >
      {isTop && <div className="absolute top-0 left-0 w-1 h-full bg-gold" />}
      <div className="flex items-center gap-6 md:gap-8 w-full md:w-1/3">
        <span
          className={cn(
            'font-display text-surface-container-highest select-none group-hover:text-gold transition-colors duration-500',
            isTop ? 'text-display-xl' : 'text-headline-xl w-16 text-center group-hover:text-primary',
          )}
        >
          {rankDisplay}
        </span>
        <div className="relative">
          <img
            src={item.thumbnailUrl}
            alt={item.channelTitle}
            className={cn('rounded-full object-cover shadow-sm', isTop ? 'w-20 h-20' : 'w-16 h-16 border border-border')}
          />
          {isTop && (
            <div className="absolute -bottom-2 -right-2 bg-surface rounded-full p-1 shadow-sm">
              <span className="material-symbols-outlined text-gold text-[16px]">verified</span>
            </div>
          )}
        </div>
        <div>
          <h3 className={cn('font-display text-primary leading-tight', isTop ? 'text-headline-lg' : 'text-headline-lg-mobile')}>
            {item.channelTitle}
          </h3>
          <p className="text-label-sm text-muted uppercase tracking-wider mt-1">
            {translateCategory(locale, item.category)}
          </p>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full items-center">
        <div>
          <p className="text-label-sm text-muted uppercase tracking-wider mb-1">{t.rankings.subscribers}</p>
          <p className={cn('text-primary', isTop ? 'font-display text-headline-lg-mobile' : 'font-body text-body-md font-medium')}>
            {formatNumber(item.subscriberCount)}
          </p>
        </div>
        <div>
          <p className="text-label-sm text-muted uppercase tracking-wider mb-1">{t.rankings.growth30d}</p>
          <div className={cn('flex items-center gap-1', growthPositive ? 'text-[#22c55e]' : 'text-on-tertiary-container')}>
            <span className="material-symbols-outlined text-[20px]">
              {growthPositive ? 'arrow_upward' : 'arrow_downward'}
            </span>
            <span className={cn(isTop ? 'font-display text-headline-lg-mobile' : 'font-body text-body-md font-medium')}>
              {growthPositive ? '+' : ''}
              {item.growthPercent.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="relative">
          <p className="text-label-sm text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            {t.rankings.aiQuality}
          </p>
          <div className="flex items-end gap-1">
            <span className={cn('text-primary', isTop ? 'font-display text-headline-lg-mobile' : 'font-body text-body-md font-medium')}>
              {item.aiQualityScore}
            </span>
            <span className="font-body text-body-md text-muted mb-1">/100</span>
          </div>
          {isTop && (
            <div className="absolute inset-0 bg-gold/5 rounded-lg -m-2 -z-10 blur-sm pointer-events-none" />
          )}
        </div>
        <div className="flex flex-col justify-end items-end h-full w-full opacity-60 group-hover:opacity-100 transition-opacity">
          <Sparkline data={item.sparkline} />
        </div>
      </div>
    </article>
  )
}
