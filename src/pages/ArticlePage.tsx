import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { AISummaryWidget } from '@/components/ai/AISummaryWidget'
import { ArticleCard } from '@/components/cards/ArticleCard'
import { ArticleEditorPanel } from '@/components/editor/ArticleEditorPanel'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { translateCategory } from '@/i18n/locales'
import { api } from '@/lib/api'
import type { EditorialArticle } from '@/types'
import { formatDate, formatDuration, estimateReadTime } from '@/lib/utils'

export function ArticlePage() {
  const { videoId } = useParams<{ videoId: string }>()
  const { t, locale } = useTranslation()
  const { isEditor } = useAuth()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const dateLocale = locale === 'ko' ? 'ko-KR' : 'en-US'

  const { data: video, isLoading: videoLoading } = useQuery({
    queryKey: ['video', videoId],
    queryFn: () => api.video(videoId!),
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000,
  })

  const { data: editorial, isLoading: editorialLoading, error } = useQuery({
    queryKey: ['editorial', videoId, locale],
    queryFn: () => api.editorial(videoId!, locale),
    enabled: !!videoId,
    staleTime: 24 * 60 * 60 * 1000,
  })

  const { data: related } = useQuery({
    queryKey: ['related', editorial?.article.category],
    queryFn: () => api.search(editorial?.article.category || 'technology', 3),
    enabled: !!editorial?.article.category,
    staleTime: 5 * 60 * 1000,
  })

  const saveMutation = useMutation({
    mutationFn: (article: EditorialArticle) =>
      api.saveEditorial(videoId!, locale, article),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editorial', videoId, locale] })
      setIsEditing(false)
      setStatusMessage(t.auth.saved)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteEditorial(videoId!, locale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editorial', videoId, locale] })
      setIsEditing(false)
      setStatusMessage(t.auth.deleted)
    },
  })

  const handleDelete = () => {
    if (window.confirm(t.auth.deleteConfirm)) {
      deleteMutation.mutate()
    }
  }

  if (videoLoading) {
    return (
      <main className="pt-8 px-margin-mobile md:px-margin-desktop max-w-content-width mx-auto">
        <Skeleton className="h-12 w-2/3 mb-6" />
        <Skeleton className="aspect-video w-full mb-8" />
        <Skeleton className="h-48 w-full" />
      </main>
    )
  }

  if (!video) {
    return (
      <main className="pt-32 text-center px-margin-mobile">
        <h1 className="font-display text-headline-xl text-primary mb-4">{t.article.notFound}</h1>
        <Link to="/" className="text-gold hover:text-primary">{t.article.returnHome}</Link>
      </main>
    )
  }

  const article = editorial?.article
  const readTime = article
    ? estimateReadTime([article.summary, article.whyItMatters, ...(article.editorialBody || [])].join(' '))
    : 8

  const tocIds = ['ai-summary', 'key-insights', 'why-it-matters', 'ai-opinion', 'related-videos']

  return (
    <main className="flex-grow">
      <section className="w-full relative bg-surface-container-lowest border-b border-border">
        <div className="max-w-content-width mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-gold text-label-md uppercase tracking-widest">
                {article?.category
                  ? translateCategory(locale, article.category)
                  : t.article.videoAnalysis}
              </span>
              {editorial?.source === 'editor' && (
                <span className="text-label-sm px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                  {t.auth.editorCurated}
                </span>
              )}
            </div>
            <h1 className="font-display text-display-xl text-primary mb-6">
              {article?.headline || video.title}
            </h1>
            <p className="text-body-lg text-muted max-w-3xl">
              {article?.summary || video.description.slice(0, 200)}
            </p>
          </div>
          <div className="relative w-full aspect-video bg-surface-dim rounded-xl overflow-hidden shadow-sm group">
            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 bg-primary/20 flex items-center justify-center transition-opacity group-hover:bg-primary/30"
            >
              <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
                <span className="material-symbols-outlined text-primary text-[40px] material-symbols-filled">
                  play_arrow
                </span>
              </div>
            </a>
          </div>
          <div className="flex items-center justify-between mt-6 border-b border-border pb-6 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
              <div>
                <p className="text-label-md text-primary">
                  {t.article.by} {video.channelTitle}
                </p>
                <p className="text-label-sm text-muted">
                  {t.article.published} {formatDate(video.publishedAt, dateLocale)} • {readTime} {t.article.minRead} • {formatDuration(video.duration)}
                </p>
              </div>
            </div>
            {isEditor && article && !isEditing && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  {t.auth.editArticle}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {t.auth.deleteArticle}
                </Button>
              </div>
            )}
          </div>
          {statusMessage && (
            <p className="text-label-sm text-gold mt-4">{statusMessage}</p>
          )}
        </div>
      </section>

      <div className="max-w-content-width mx-auto px-margin-mobile md:px-margin-desktop py-16 flex flex-col lg:flex-row gap-gutter relative">
        {!isEditing && (
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32">
              <h3 className="text-label-md text-muted uppercase tracking-widest mb-6">{t.article.inThisArticle}</h3>
              <ul className="space-y-4">
                {t.article.toc.map((item, index) => (
                  <li key={item}>
                    <a
                      href={`#${tocIds[index]}`}
                      className={`text-body-md border-l-2 pl-4 block ${
                        index === 0
                          ? 'text-primary font-medium border-gold'
                          : 'text-muted hover:text-primary border-transparent'
                      }`}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        <article className="flex-grow max-w-[800px] editorial-content">
          {editorialLoading ? (
            <div className="space-y-6">
              <div className="ai-widget rounded-xl p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-gold animate-pulse">auto_awesome</span>
                  <span className="text-label-md text-muted">{t.article.aiWriting}</span>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ) : error ? (
            <div className="ai-widget rounded-xl p-8 text-muted">
              {t.article.editorialError}: {(error as Error).message}
            </div>
          ) : article && isEditing ? (
            <ArticleEditorPanel
              article={article}
              onSave={async (updated) => {
                await saveMutation.mutateAsync(updated)
              }}
              onCancel={() => setIsEditing(false)}
              isSaving={saveMutation.isPending}
            />
          ) : article ? (
            <>
              <div id="ai-summary">
                <AISummaryWidget title={t.article.aiSummary}>{article.summary}</AISummaryWidget>
              </div>

              {(article.editorialBody || []).map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-body-lg ${index === 0 ? 'first-letter:float-left first-letter:text-[80px] first-letter:pr-2 first-letter:font-display first-letter:leading-[64px] first-letter:text-primary' : ''}`}
                >
                  {paragraph}
                </p>
              ))}

              <div className="my-16" id="key-insights">
                <h2 className="font-display text-headline-xl text-primary mb-8">{t.article.keyInsights}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.keyInsights.map((insight) => (
                    <div
                      key={insight.title}
                      className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <span className="material-symbols-outlined text-gold text-[32px] mb-4 block">
                        lightbulb
                      </span>
                      <h4 className="font-display text-xl text-primary mb-2">{insight.title}</h4>
                      <p className="text-body-md text-muted m-0">{insight.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <h2 className="font-display text-headline-xl text-primary" id="why-it-matters">
                {t.article.whyItMatters}
              </h2>
              <p className="text-body-lg">{article.whyItMatters}</p>

              {article.keyQuotes[0] && (
                <blockquote className="border-l-4 border-gold pl-6 py-2 my-10 bg-surface-container-lowest">
                  <p className="font-display text-[32px] leading-[40px] text-primary m-0 italic">
                    "{article.keyQuotes[0]}"
                  </p>
                </blockquote>
              )}

              <div id="ai-opinion">
                <h2 className="font-display text-headline-xl text-primary">{t.article.aiOpinion}</h2>
                <p className="text-body-lg">{article.aiOpinion}</p>
              </div>

              <div className="mt-8 p-6 bg-surface-container-low rounded-xl">
                <h4 className="text-label-md text-muted uppercase tracking-widest mb-2">{t.article.audience}</h4>
                <p className="text-body-md m-0">{article.audience}</p>
              </div>
            </>
          ) : null}
        </article>
      </div>

      {!isEditing && (
        <section className="bg-surface border-t border-border py-24" id="related-videos">
          <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex justify-between items-end mb-12">
              <h2 className="font-display text-headline-xl text-primary">{t.article.relatedVideos}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {(related?.videos || [])
                .filter((v) => v.id !== videoId)
                .slice(0, 3)
                .map((relatedVideo) => (
                  <ArticleCard key={relatedVideo.id} video={relatedVideo} variant="grid" />
                ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
