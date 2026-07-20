import type { VercelRequest, VercelResponse } from '@vercel/node'
import { CACHE_TTL, getCache, setCache } from '../../server/lib/cache.js'
import { generateEditorial } from '../../server/lib/editorial.js'
import { getVideoById } from '../../server/lib/youtube.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  try {
    const videoId = String(req.query.videoId || '')
    if (!videoId) {
      res.status(400).json({ error: 'videoId is required' })
      return
    }
    const cacheKey = `editorial:${videoId}`
    const cached = getCache<{ video: unknown; article: unknown; cached: boolean }>(cacheKey)
    if (cached) {
      res.json({ ...cached, cached: true })
      return
    }
    const video = await getVideoById(videoId)
    if (!video) {
      res.status(404).json({ error: 'Video not found' })
      return
    }
    const article = await generateEditorial(video)
    const payload = { video, article, cached: false }
    setCache(cacheKey, payload, CACHE_TTL.editorial)
    res.json(payload)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
