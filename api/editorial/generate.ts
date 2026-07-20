import type { VercelRequest, VercelResponse } from '@vercel/node'
import { resolveEditorial } from '../../server/lib/editorial-service.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  try {
    const videoId = String(req.query.videoId || '')
    const lang = req.query.lang === 'ko' ? 'ko' : 'en'
    if (!videoId) {
      res.status(400).json({ error: 'videoId is required' })
      return
    }
    const result = await resolveEditorial(videoId, lang)
    if (!result) {
      res.status(404).json({ error: 'Video not found' })
      return
    }
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
