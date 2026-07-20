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

export interface SearchResponse {
  videos: Video[]
  totalResults: number
}

export interface TrendingResponse {
  videos: Video[]
}

export interface EditorialResponse {
  video: Video
  article: EditorialArticle
  cached: boolean
  source?: 'editor' | 'cache' | 'generated'
}

export type UserRole = 'reader' | 'editor'

export interface AuthSession {
  token: string
  role: UserRole
  expiresAt: string
}

export interface AuthMeResponse {
  role: UserRole | null
  authenticated: boolean
}

export interface RankingsResponse {
  items: RankingItem[]
  category: string
  updatedAt: string
}

export const CATEGORIES = [
  'Technology',
  'AI',
  'Finance',
  'Lifestyle',
  'Gaming',
  'Travel',
  'Music',
  'Design',
] as const

export type Category = (typeof CATEGORIES)[number]

export const RANKING_FILTERS = ['Global', 'Technology', 'Culture'] as const
export type RankingFilter = (typeof RANKING_FILTERS)[number]

export const TRENDING_TOPICS = [
  'AI Filmmaking',
  'Creator Economy',
  'Sora vs Runway',
  'Retention Strategies',
  'MrBeast Analytics',
] as const
