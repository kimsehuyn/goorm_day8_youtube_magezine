import type { VercelRequest, VercelResponse } from '@vercel/node'
import { CACHE_TTL, getCache, setCache } from '../../server/lib/cache.js'
import { buildRankings } from '../../server/lib/rankings.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  try {
    const category = String(req.query.category || 'Global')
    const limit = parseInt(String(req.query.limit || '20'), 10)
    const cacheKey = `rankings:${category}:${limit}`
    const cached = getCache<{ items: unknown[]; category: string; updatedAt: string }>(cacheKey)
    if (cached) {
      res.json(cached)
      return
    }
    const items = await buildRankings(category, limit)
    const payload = { items, category, updatedAt: new Date().toISOString() }
    setCache(cacheKey, payload, CACHE_TTL.rankings)
    res.json(payload)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
