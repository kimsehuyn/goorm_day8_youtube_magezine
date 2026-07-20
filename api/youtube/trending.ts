import type { VercelRequest, VercelResponse } from '@vercel/node'
import { CACHE_TTL, getCache, setCache } from '../../server/lib/cache.js'
import { getTrendingVideos } from '../../server/lib/youtube.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  try {
    const category = req.query.category ? String(req.query.category) : undefined
    const maxResults = parseInt(String(req.query.maxResults || '12'), 10)
    const cacheKey = `trending:${category || 'all'}:${maxResults}`
    const cached = getCache<{ videos: unknown[] }>(cacheKey)
    if (cached) {
      res.json(cached)
      return
    }
    const videos = await getTrendingVideos(category, maxResults)
    const payload = { videos }
    setCache(cacheKey, payload, CACHE_TTL.youtube)
    res.json(payload)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
