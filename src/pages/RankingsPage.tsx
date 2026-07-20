import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RankingCard } from '@/components/cards/RankingCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { RANKING_FILTERS, type RankingFilter } from '@/types'

export function RankingsPage() {
  const [filter, setFilter] = useState<RankingFilter>('Global')
  const [limit, setLimit] = useState(20)

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['rankings', filter, limit],
    queryFn: () => api.rankings(filter, limit),
    staleTime: 10 * 60 * 1000,
  })

  return (
    <main className="pt-12 pb-24 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
      <header className="mb-16 max-w-3xl">
        <h1 className="font-display text-display-xl text-primary mb-6">Global Power Index</h1>
        <p className="text-body-lg text-on-surface-variant">
          The definitive ranking of digital influence, curated by our proprietary AI model assessing
          reach, engagement velocity, and editorial quality score.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-6 mb-12 pb-6 border-b border-outline-variant/50">
        <div className="flex gap-4 flex-wrap">
          {RANKING_FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setFilter(item)
                setLimit(20)
              }}
              className={cn(
                'px-6 py-2 rounded-full border text-label-md transition-colors',
                filter === item
                  ? 'border-primary text-primary bg-surface shadow-sm'
                  : 'border-border text-on-surface-variant hover:border-primary',
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant text-label-sm">
          <span className="material-symbols-outlined text-gold">update</span>
          {isFetching ? 'Updating...' : 'Updated Real-Time'}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-muted mb-4">{(error as Error).message}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {data?.items.map((item) => (
            <RankingCard key={`${item.channelId}-${item.rank}`} item={item} />
          ))}
        </div>
      )}

      {data && data.items.length >= limit && (
        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setLimit((prev) => prev + 20)}
            disabled={isFetching}
          >
            Load Next 20
            <span className="material-symbols-outlined">expand_more</span>
          </Button>
        </div>
      )}
    </main>
  )
}
