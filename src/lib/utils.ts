import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toLocaleString()
}

export function formatDate(dateString: string, locale = 'en-US'): string {
  return new Date(dateString).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'
  const hours = parseInt(match[1] || '0', 10)
  const minutes = parseInt(match[2] || '0', 10)
  const seconds = parseInt(match[3] || '0', 10)
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).length
  return Math.max(3, Math.ceil(words / 200))
}

const SEARCH_HISTORY_KEY = 'ytmag-search-history'
const MAX_HISTORY = 8

export function getSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function addSearchHistory(query: string): void {
  const trimmed = query.trim()
  if (!trimmed) return
  const history = getSearchHistory().filter((item) => item !== trimmed)
  history.unshift(trimmed)
  localStorage.setItem(
    SEARCH_HISTORY_KEY,
    JSON.stringify(history.slice(0, MAX_HISTORY)),
  )
}

export function getEditorialCacheKey(videoId: string): string {
  return `ytmag-editorial-${videoId}`
}

export function getCachedEditorial<T>(videoId: string): T | null {
  try {
    const raw = localStorage.getItem(getEditorialCacheKey(videoId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as { data: T; expiresAt: number }
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(getEditorialCacheKey(videoId))
      return null
    }
    return parsed.data
  } catch {
    return null
  }
}

export function setCachedEditorial<T>(videoId: string, data: T): void {
  localStorage.setItem(
    getEditorialCacheKey(videoId),
    JSON.stringify({ data, expiresAt: Date.now() + 24 * 60 * 60 * 1000 }),
  )
}
