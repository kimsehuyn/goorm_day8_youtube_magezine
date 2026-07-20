import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { CACHE_TTL, getCache, setCache } from './lib/cache.js'
import { generateEditorial } from './lib/editorial.js'
import { buildRankings } from './lib/rankings.js'
import {
  getTrendingVideos,
  getVideoById,
  searchVideos,
} from './lib/youtube.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/api/youtube/search', async (req, res) => {
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
})

app.get('/api/youtube/trending', async (req, res) => {
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
})

app.get('/api/youtube/video/:id', async (req, res) => {
  try {
    const { id } = req.params
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
})

app.get('/api/editorial/generate', async (req, res) => {
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
})

app.get('/api/rankings', async (req, res) => {
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
})

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`)
})
