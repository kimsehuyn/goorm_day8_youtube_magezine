import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifyEditorToken } from '../../server/lib/auth.js'
import {
  removeEditorial,
  resolveEditorial,
  upsertEditorial,
} from '../../server/lib/editorial-service.js'
import type { EditorialArticle } from '../../server/lib/youtube.js'
import { getVideoById } from '../../server/lib/youtube.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const videoId = String(req.query.videoId || '')
  const lang = req.query.lang === 'ko' ? 'ko' : 'en'

  if (!videoId) {
    res.status(400).json({ error: 'videoId is required' })
    return
  }

  if (req.method === 'PUT') {
    if (!verifyEditorToken(req.headers.authorization)) {
      res.status(403).json({ error: 'Editor access required' })
      return
    }
    try {
      const article = req.body?.article as EditorialArticle
      if (!article?.headline || !article?.summary) {
        res.status(400).json({ error: 'Invalid article payload' })
        return
      }
      const video = await getVideoById(videoId)
      if (!video) {
        res.status(404).json({ error: 'Video not found' })
        return
      }
      upsertEditorial(videoId, lang, article)
      res.json({ video, article, cached: true, source: 'editor' })
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
    return
  }

  if (req.method === 'DELETE') {
    if (!verifyEditorToken(req.headers.authorization)) {
      res.status(403).json({ error: 'Editor access required' })
      return
    }
    removeEditorial(videoId, lang)
    const regenerated = await resolveEditorial(videoId, lang)
    res.json(regenerated ?? { deleted: true })
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
