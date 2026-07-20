import type {
  AuthMeResponse,
  AuthSession,
  EditorialArticle,
  EditorialResponse,
  RankingsResponse,
  SearchResponse,
  TrendingResponse,
  Video,
} from '@/types'

import type { Locale } from '@/i18n/locales'
import { getAuthHeaders } from '@/lib/auth-storage'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...getAuthHeaders(),
      ...(init?.headers || {}),
    },
  })
  if (!response.ok) {
    const error = await response.text()
    const err = new Error(error || `Request failed: ${response.status}`) as Error & {
      status: number
    }
    err.status = response.status
    throw err
  }
  return response.json() as Promise<T>
}

export const api = {
  authLogin: (secretKey: string) =>
    fetchApi<AuthSession>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secretKey }),
    }),

  authMe: () => fetchApi<AuthMeResponse>('/api/auth/me'),

  authLogout: () =>
    fetchApi<{ ok: boolean }>('/api/auth/login', { method: 'DELETE' }),

  search: (q: string, maxResults = 12) =>
    fetchApi<SearchResponse>(
      `/api/youtube/search?q=${encodeURIComponent(q)}&maxResults=${maxResults}`,
    ),

  trending: (category?: string, maxResults = 12) => {
    const params = new URLSearchParams({ maxResults: String(maxResults) })
    if (category) params.set('category', category)
    return fetchApi<TrendingResponse>(`/api/youtube/trending?${params}`)
  },

  video: (id: string) => fetchApi<Video>(`/api/youtube/video/${id}`),

  editorial: (videoId: string, lang: Locale = 'en') =>
    fetchApi<EditorialResponse>(
      `/api/editorial/generate?videoId=${videoId}&lang=${lang}`,
    ),

  saveEditorial: (videoId: string, lang: Locale, article: EditorialArticle) =>
    fetchApi<EditorialResponse>(
      `/api/editorial/manage?videoId=${videoId}&lang=${lang}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article }),
      },
    ),

  deleteEditorial: (videoId: string, lang: Locale) =>
    fetchApi<EditorialResponse>(
      `/api/editorial/manage?videoId=${videoId}&lang=${lang}`,
      { method: 'DELETE' },
    ),

  rankings: (category = 'Global', limit = 20) =>
    fetchApi<RankingsResponse>(
      `/api/rankings?category=${encodeURIComponent(category)}&limit=${limit}`,
    ),
}
