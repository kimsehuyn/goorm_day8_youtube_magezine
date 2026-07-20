import type { VercelRequest, VercelResponse } from '@vercel/node'
import { CACHE_TTL, getCache, setCache } from '../../server/lib/cache.js'
import { getVideoById } from '../../server/lib/youtube.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  try {
    const id = String(req.query.id || '')
    if (!id) {
      res.status(400).json({ error: 'id is required' })
      return
    }
    const cacheKey = `video:${id}`
    const cached = getCache<unknown>(cacheKey)
    if (cached) {
      res.json(cached)
      return
    }
    const video = await getVideoById(id)
    if (!video) {
      res.status(404).json({ error: 'Video not found' })
      return
    }
    setCache(cacheKey, video, CACHE_TTL.youtube)
    res.json(video)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
