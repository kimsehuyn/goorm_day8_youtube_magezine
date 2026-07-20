import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { ArticleCard } from '@/components/cards/ArticleCard'
import { useSearchOverlay } from '@/contexts/SearchContext'
import { api } from '@/lib/api'
import { addSearchHistory, getSearchHistory } from '@/lib/utils'
import { TRENDING_TOPICS } from '@/types'

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function SearchOverlay() {
  const { isOpen, closeSearch } = useSearchOverlay()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const debouncedQuery = useDebouncedValue(query, 300)
  const isActive = debouncedQuery.trim().length > 1

  useEffect(() => {
    if (isOpen) setHistory(getSearchHistory())
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) setQuery('')
  }, [isOpen])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) closeSearch()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeSearch])

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => api.search(debouncedQuery, 12),
    enabled: isActive,
    staleTime: 5 * 60 * 1000,
  })

  const handleSelect = (videoId: string, searchTerm: string) => {
    addSearchHistory(searchTerm)
    closeSearch()
    navigate(`/article/${videoId}`)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-surface/95 backdrop-blur-3xl w-full h-full overflow-y-auto"
        >
          <header className="w-full pt-16 pb-12 px-margin-mobile md:px-margin-desktop border-b border-surface-variant sticky top-0 bg-surface/90 backdrop-blur-md z-10">
            <div className="max-w-content-width mx-auto flex items-center justify-between gap-6 relative">
              <div className="flex-1 relative flex items-center">
                <span className="material-symbols-outlined absolute left-0 text-primary opacity-50 text-[32px]">
                  search
                </span>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent border-none font-display text-display-xl text-primary pl-14 py-4 placeholder:font-display focus:ring-0 outline-none"
                  placeholder="Search YTMAG..."
                  type="text"
                />
              </div>
              <button
                type="button"
                aria-label="Close search"
                onClick={closeSearch}
                className="shrink-0 p-4 rounded-full hover:bg-surface-container transition-colors group flex items-center justify-center border border-outline-variant/50"
              >
                <span className="material-symbols-outlined text-primary group-hover:rotate-90 transition-transform duration-300">
                  close
                </span>
              </button>
            </div>
          </header>

          <div className="flex-1 w-full max-w-content-width mx-auto px-margin-mobile md:px-margin-desktop py-12">
            {!isActive ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter w-full">
                <div className="md:col-span-4 flex flex-col gap-12">
                  <section>
                    <h3 className="text-label-md text-muted uppercase tracking-widest mb-6">Recent History</h3>
                    {history.length ? (
                      <ul className="flex flex-col gap-4">
                        {history.map((item) => (
                          <li key={item}>
                            <button
                              type="button"
                              onClick={() => setQuery(item)}
                              className="group flex items-center gap-4 py-2 hover:opacity-80 transition-opacity w-full text-left"
                            >
                              <span className="material-symbols-outlined text-outline-variant">history</span>
                              <span className="text-body-md text-on-surface group-hover:text-gold transition-colors">
                                {item}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted text-body-md">No recent searches yet.</p>
                    )}
                  </section>
                  <section>
                    <h3 className="text-label-md text-muted uppercase tracking-widest mb-6">Trending Topics</h3>
                    <div className="flex flex-wrap gap-3">
                      {TRENDING_TOPICS.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => setQuery(topic)}
                          className="px-4 py-2 rounded-full border border-border bg-surface-container-lowest text-label-sm text-on-surface hover:border-gold hover:text-gold transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
                <div className="md:col-span-8 flex flex-col gap-8 md:pl-12 border-t md:border-t-0 md:border-l border-surface-variant pt-12 md:pt-0">
                  <h3 className="text-label-md text-muted uppercase tracking-widest mb-2">Curated Collections</h3>
                  <p className="text-body-md text-muted">
                    Search for any YouTube topic to discover AI-curated magazine stories.
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-12">
                <div className="flex items-center justify-between border-b border-surface-variant pb-4">
                  <h2 className="text-body-lg text-muted">
                    Results for <span className="text-primary font-medium">"{debouncedQuery}"</span>
                  </h2>
                  {isLoading && <span className="text-label-sm text-muted">Searching...</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                  {data?.videos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => handleSelect(video.id, debouncedQuery)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSelect(video.id, debouncedQuery)}
                      role="button"
                      tabIndex={0}
                    >
                      <ArticleCard video={video} variant="grid" />
                    </div>
                  ))}
                </div>
                {!isLoading && data?.videos.length === 0 && (
                  <p className="text-muted text-center py-12">No results found.</p>
                )}
              </div>
            )}
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  )
}
