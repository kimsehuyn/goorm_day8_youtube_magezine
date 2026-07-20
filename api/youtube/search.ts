import type { VercelRequest, VercelResponse } from '@vercel/node'
import { CACHE_TTL, getCache, setCache } from '../../server/lib/cache.js'
import { searchVideos } from '../../server/lib/youtube.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  try {
    const q = String(req.query.q || '')
    const maxResults = parseInt(String(req.query.maxResults || '12'), 10)
    if (!q.trim()) {
      res.status(400).json({ error: 'Query parameter q is required' })
      return
    }
    const cacheKey = `search:${q}:${maxResults}`
    const cached = getCache<{ videos: unknown[]; totalResults: number }>(cacheKey)
    if (cached) {
      res.json(cached)
      return
    }
    const videos = await searchVideos(q, maxResults)
    const payload = { videos, totalResults: videos.length }
    setCache(cacheKey, payload, CACHE_TTL.youtube)
    res.json(payload)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
