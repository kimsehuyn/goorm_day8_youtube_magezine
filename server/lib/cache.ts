const cache = new Map<string, { value: unknown; expiresAt: number }>()

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }
  return entry.value as T
}

export function setCache<T>(key: string, value: T, ttlMs: number): void {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs })
}

export const CACHE_TTL = {
  youtube: 5 * 60 * 1000,
  editorial: 24 * 60 * 60 * 1000,
  rankings: 10 * 60 * 1000,
}
