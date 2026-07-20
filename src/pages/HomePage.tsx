import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArticleCard } from '@/components/cards/ArticleCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from '@/contexts/LanguageContext'
import { translateCategory } from '@/i18n/locales'
import { api } from '@/lib/api'
import { CATEGORIES } from '@/types'

function SectionHeader({ title, to, viewAllLabel }: { title: string; to?: string; viewAllLabel: string }) {
  return (
    <div className="flex justify-between items-end mb-12 border-b border-border pb-4">
      <h2 className="font-display text-headline-xl text-primary">{title}</h2>
      {to && (
        <Link
          to={to}
          className="text-label-md text-muted hover:text-primary transition-colors flex items-center gap-1"
        >
          {viewAllLabel}
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </Link>
      )}
    </div>
  )
}

function HomeSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="w-full min-h-[60vh]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <Skeleton className="h-72 md:col-span-2" />
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  )
}

export function HomePage() {
  const { t, locale } = useTranslation()

  const { data: trending, isLoading, error } = useQuery({
    queryKey: ['trending'],
    queryFn: () => api.trending(undefined, 12),
    staleTime: 5 * 60 * 1000,
  })

  const coverVideo = trending?.videos[0]
  const { data: coverEditorial } = useQuery({
    queryKey: ['editorial', coverVideo?.id, locale],
    queryFn: () => api.editorial(coverVideo!.id, locale),
    enabled: !!coverVideo?.id,
    staleTime: 24 * 60 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <main className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto py-16">
        <HomeSkeleton />
      </main>
    )
  }

  if (error || !trending?.videos.length) {
    return (
      <main className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto py-32 text-center">
        <h1 className="font-display text-headline-xl text-primary mb-4">{t.home.loadError}</h1>
        <p className="text-muted mb-8">{(error as Error)?.message || t.home.noTrending}</p>
        <p className="text-label-sm text-muted">{t.home.apiHint}</p>
      </main>
    )
  }

  const [featured, ...rest] = trending.videos
  const compactCards = rest.slice(0, 2)
  const editorPicks = rest.slice(2, 5)
  const latestStories = rest.slice(5, 11)

  const coverCategory = coverEditorial?.article.category
    ? translateCategory(locale, coverEditorial.article.category)
    : t.home.featured

  return (
    <main>
      <section className="relative w-full min-h-[85vh] flex items-end pb-24 md:pb-32 px-margin-mobile md:px-margin-desktop bg-surface-container-highest group">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={featured.thumbnailUrl}
            alt={featured.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-content-width mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="col-span-1 md:col-span-8 lg:col-span-7">
            <div className="inline-flex items-center px-3 py-1 mb-6 bg-gold/10 border border-gold/30 rounded backdrop-blur-md">
              <span className="text-label-sm text-gold uppercase tracking-widest mr-2">{t.home.coverStory}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            </div>
            <h1 className="font-display text-display-xl md:text-[88px] md:leading-[96px] text-primary mb-6">
              {coverEditorial?.article.headline || featured.title}
            </h1>
            <div className="bg-surface/60 backdrop-blur-xl border border-border p-6 rounded-lg mb-8 max-w-xl shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-gold text-sm">auto_awesome</span>
                <span className="text-label-sm text-muted uppercase tracking-wider">{t.home.aiExecutiveSummary}</span>
              </div>
              <p className="text-body-md text-on-surface-variant">
                {coverEditorial?.article.summary || featured.description.slice(0, 220)}
              </p>
            </div>
            <Button asChild>
              <Link to={`/article/${featured.id}`}>
                {t.home.readStory}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop space-y-32 py-16">
        <section>
          <div className="flex flex-wrap gap-3 mb-12">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className="px-4 py-2 rounded-full border border-border bg-surface-container-lowest text-label-sm text-on-surface hover:border-gold hover:text-gold transition-colors"
              >
                {translateCategory(locale, category)}
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title={t.home.trendingNow} to="/rankings" viewAllLabel={t.home.viewAll} />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter auto-rows-[300px]">
            <ArticleCard
              video={featured}
              variant="featured"
              category={coverCategory}
              insightScore={coverEditorial?.article.qualityScore}
            />
            {compactCards.map((video, index) => (
              <ArticleCard
                key={video.id}
                video={video}
                variant="compact"
                category={translateCategory(locale, index === 0 ? 'Technology' : 'Culture')}
                className="md:col-span-4 row-span-1"
              />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title={t.home.editorsPicks} viewAllLabel={t.home.viewAll} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {editorPicks.map((video) => (
              <ArticleCard
                key={video.id}
                video={video}
                variant="grid"
                category={t.home.editorsPick}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title={t.home.latestStories} viewAllLabel={t.home.viewAll} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {latestStories.map((video) => (
              <ArticleCard key={video.id} video={video} variant="grid" />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
