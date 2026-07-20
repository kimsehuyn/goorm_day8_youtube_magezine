import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ReaderGate } from '@/components/auth/ReaderGate'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AppLayout } from '@/components/layout/AppLayout'
import { SearchOverlay } from '@/components/search/SearchOverlay'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
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

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined text-gold text-4xl animate-pulse">auto_awesome</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <ReaderGate />
  }

  return (
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
  )
}

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <AppRoutes />
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
