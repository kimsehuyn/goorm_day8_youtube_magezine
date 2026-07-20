import type {
  EditorialResponse,
  RankingsResponse,
  SearchResponse,
  TrendingResponse,
  Video,
} from '@/types'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `Request failed: ${response.status}`)
  }
  return response.json() as Promise<T>
}

export const api = {
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

  editorial: (videoId: string) =>
    fetchApi<EditorialResponse>(`/api/editorial/generate?videoId=${videoId}`),

  rankings: (category = 'Global', limit = 20) =>
    fetchApi<RankingsResponse>(
      `/api/rankings?category=${encodeURIComponent(category)}&limit=${limit}`,
    ),
}
