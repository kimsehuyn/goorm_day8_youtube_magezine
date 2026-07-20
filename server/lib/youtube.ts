export interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  channelTitle: string
  channelId: string
  viewCount: number
  likeCount: number
  commentCount: number
  publishedAt: string
  duration: string
  tags: string[]
  categoryId?: string
}

export interface Channel {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  subscriberCount: number
  videoCount: number
  viewCount: number
}

export interface EditorialArticle {
  headline: string
  summary: string
  whyItMatters: string
  keyInsights: { title: string; body: string }[]
  aiOpinion: string
  audience: string
  keyQuotes: string[]
  category: string
  qualityScore: number
  editorialBody?: string[]
}

export interface RankingItem {
  rank: number
  channelId: string
  channelTitle: string
  thumbnailUrl: string
  category: string
  subscriberCount: number
  growthPercent: number
  aiQualityScore: number
  compositeScore: number
  sparkline: number[]
  videoId?: string
  videoTitle?: string
}

const CATEGORY_MAP: Record<string, string> = {
  Global: '0',
  Technology: '28',
  Culture: '24',
}

export function getCategoryId(category?: string): string | undefined {
  if (!category || category === 'Global') return undefined
  return CATEGORY_MAP[category]
}

export function getYouTubeKey(): string {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) throw new Error('YOUTUBE_API_KEY is not configured')
  return key
}

export function getOpenAIKey(): string {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY is not configured')
  return key
}

export async function youtubeFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`)
  url.searchParams.set('key', getYouTubeKey())
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  const response = await fetch(url.toString())
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`YouTube API error: ${response.status} ${text}`)
  }
  return response.json() as Promise<T>
}

interface YouTubeThumbnail {
  url: string
}

interface YouTubeVideoItem {
  id: string
  snippet: {
    title: string
    description: string
    channelTitle: string
    channelId: string
    publishedAt: string
    tags?: string[]
    categoryId?: string
    thumbnails: { high?: YouTubeThumbnail; medium?: YouTubeThumbnail }
  }
  statistics?: {
    viewCount?: string
    likeCount?: string
    commentCount?: string
  }
  contentDetails?: { duration?: string }
}

interface YouTubeChannelItem {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: { default?: YouTubeThumbnail; medium?: YouTubeThumbnail }
  }
  statistics?: {
    subscriberCount?: string
    videoCount?: string
    viewCount?: string
  }
}

function mapVideo(item: YouTubeVideoItem): Video {
  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails.high?.url ||
      item.snippet.thumbnails.medium?.url ||
      '',
    channelTitle: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    viewCount: parseInt(item.statistics?.viewCount || '0', 10),
    likeCount: parseInt(item.statistics?.likeCount || '0', 10),
    commentCount: parseInt(item.statistics?.commentCount || '0', 10),
    publishedAt: item.snippet.publishedAt,
    duration: item.contentDetails?.duration || 'PT0S',
    tags: item.snippet.tags || [],
    categoryId: item.snippet.categoryId,
  }
}

function mapChannel(item: YouTubeChannelItem): Channel {
  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails.medium?.url ||
      item.snippet.thumbnails.default?.url ||
      '',
    subscriberCount: parseInt(item.statistics?.subscriberCount || '0', 10),
    videoCount: parseInt(item.statistics?.videoCount || '0', 10),
    viewCount: parseInt(item.statistics?.viewCount || '0', 10),
  }
}

export async function searchVideos(query: string, maxResults = 12): Promise<Video[]> {
  const searchData = await youtubeFetch<{ items: { id: { videoId: string } }[] }>('search', {
    part: 'snippet',
    type: 'video',
    q: query,
    maxResults: String(maxResults),
    order: 'relevance',
  })

  const ids = searchData.items.map((item) => item.id.videoId).join(',')
  if (!ids) return []

  const videoData = await youtubeFetch<{ items: YouTubeVideoItem[] }>('videos', {
    part: 'snippet,statistics,contentDetails',
    id: ids,
  })

  return videoData.items.map(mapVideo)
}

export async function getTrendingVideos(category?: string, maxResults = 12): Promise<Video[]> {
  const params: Record<string, string> = {
    part: 'snippet,statistics,contentDetails',
    chart: 'mostPopular',
    regionCode: 'US',
    maxResults: String(maxResults),
  }
  const categoryId = getCategoryId(category)
  if (categoryId) params.videoCategoryId = categoryId

  const data = await youtubeFetch<{ items: YouTubeVideoItem[] }>('videos', params)
  return data.items.map(mapVideo)
}

export async function getVideoById(id: string): Promise<Video | null> {
  const data = await youtubeFetch<{ items: YouTubeVideoItem[] }>('videos', {
    part: 'snippet,statistics,contentDetails',
    id,
  })
  if (!data.items.length) return null
  return mapVideo(data.items[0])
}

export async function getChannelsByIds(ids: string[]): Promise<Channel[]> {
  if (!ids.length) return []
  const data = await youtubeFetch<{ items: YouTubeChannelItem[] }>('channels', {
    part: 'snippet,statistics',
    id: ids.join(','),
  })
  return data.items.map(mapChannel)
}

export { mapVideo, mapChannel }
