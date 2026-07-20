import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AppLayout } from '@/components/layout/AppLayout'
import { SearchOverlay } from '@/components/search/SearchOverlay'
import { SearchProvider } from '@/contexts/SearchContext'
import { ArticlePage } from '@/pages/ArticlePage'
import { HomePage } from '@/pages/HomePage'
import { RankingsPage } from '@/pages/RankingsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SearchProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/rankings" element={<RankingsPage />} />
                <Route path="/article/:videoId" element={<ArticlePage />} />
              </Route>
            </Routes>
            <SearchOverlay />
          </SearchProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
