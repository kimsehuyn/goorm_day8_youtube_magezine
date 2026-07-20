import { CACHE_TTL, getCache, setCache } from './cache.js'
import { generateEditorial } from './editorial.js'
import {
  deleteEditorialOverride,
  getEditorialOverride,
  saveEditorialOverride,
} from './editorial-store.js'
import type { EditorialArticle, Video } from './youtube.js'
import { getVideoById } from './youtube.js'

export interface EditorialResult {
  video: Video
  article: EditorialArticle
  cached: boolean
  source: 'editor' | 'cache' | 'generated'
}

export async function resolveEditorial(
  videoId: string,
  lang: 'en' | 'ko',
): Promise<EditorialResult | null> {
  const override = getEditorialOverride(videoId, lang)
  if (override) {
    const video = await getVideoById(videoId)
    if (!video) return null
    return {
      video,
      article: override.article,
      cached: true,
      source: 'editor',
    }
  }

  const cacheKey = `editorial:${videoId}:${lang}`
  const cached = getCache<Omit<EditorialResult, 'source'> & { source?: string }>(cacheKey)
  if (cached) {
    return { ...cached, source: 'cache' }
  }

  const video = await getVideoById(videoId)
  if (!video) return null

  const article = await generateEditorial(video, lang)
  const payload: EditorialResult = { video, article, cached: false, source: 'generated' }
  setCache(cacheKey, payload, CACHE_TTL.editorial)
  return payload
}

export function upsertEditorial(
  videoId: string,
  lang: 'en' | 'ko',
  article: EditorialArticle,
): EditorialArticle {
  saveEditorialOverride(videoId, lang, article)
  const cacheKey = `editorial:${videoId}:${lang}`
  setCache(
    cacheKey,
    { article, cached: true, source: 'editor' },
    CACHE_TTL.editorial,
  )
  return article
}

export function removeEditorial(videoId: string, lang: 'en' | 'ko'): boolean {
  deleteEditorialOverride(videoId, lang)
  return true
}
