import type { RankingItem, Video } from './youtube.js'
import { getChannelsByIds, getTrendingVideos } from './youtube.js'
import { estimateQualityScore, generateEditorial } from './editorial.js'

function normalize(value: number, max: number): number {
  if (max <= 0) return 0
  return Math.min(1, value / max)
}

function computeEngagementRate(video: Video): number {
  if (video.viewCount <= 0) return 0
  return (video.likeCount + video.commentCount) / video.viewCount
}

function computeViewVelocity(video: Video): number {
  const ageMs = Date.now() - new Date(video.publishedAt).getTime()
  const ageDays = Math.max(ageMs / (1000 * 60 * 60 * 24), 0.5)
  return video.viewCount / ageDays
}

function generateSparkline(seed: number): number[] {
  const values: number[] = []
  let current = 40 + (seed % 30)
  for (let i = 0; i < 6; i++) {
    current = Math.max(20, Math.min(100, current + ((seed + i * 7) % 15) - 5))
    values.push(current)
  }
  return values
}

function estimateGrowth(subscribers: number, rank: number): number {
  const base = 5 - rank * 0.3
  const scale = subscribers > 10_000_000 ? 0.5 : subscribers > 1_000_000 ? 1 : 2
  return Math.round((base / scale + (rank % 3) * 0.2 - 0.5) * 10) / 10
}

export async function buildRankings(category = 'Global', limit = 20): Promise<RankingItem[]> {
  const videos = await getTrendingVideos(category === 'Global' ? undefined : category, limit)
  const channelIds = [...new Set(videos.map((v) => v.channelId))]
  const channels = await getChannelsByIds(channelIds)
  const channelMap = new Map(channels.map((c) => [c.id, c]))

  const maxViews = Math.max(...videos.map(computeViewVelocity), 1)
  const maxSubs = Math.max(...channels.map((c) => c.subscriberCount), 1)

  const scored = await Promise.all(
    videos.map(async (video, index) => {
      const channel = channelMap.get(video.channelId)
      const viewVelocity = normalize(computeViewVelocity(video), maxViews)
      const engagement = Math.min(1, computeEngagementRate(video) * 50)
      const subscriberNorm = normalize(channel?.subscriberCount || 0, maxSubs)
      const uploadFrequency = Math.min(1, (channel?.videoCount || 0) / 1000)
      const trendScore = normalize(videos.length - index, videos.length)

      let aiQualityScore: number
      if (index < 5) {
        try {
          const editorial = await generateEditorial(video)
          aiQualityScore = editorial.qualityScore
        } catch {
          aiQualityScore = await estimateQualityScore(video)
        }
      } else {
        aiQualityScore = await estimateQualityScore(video)
      }

      const compositeScore =
        0.4 * viewVelocity +
        0.2 * engagement +
        0.15 * subscriberNorm +
        0.1 * uploadFrequency +
        0.1 * (aiQualityScore / 100) +
        0.05 * trendScore

      return {
        video,
        channel,
        aiQualityScore,
        compositeScore,
        growthPercent: estimateGrowth(channel?.subscriberCount || 0, index + 1),
      }
    }),
  )

  scored.sort((a, b) => b.compositeScore - a.compositeScore)

  return scored.map((entry, index) => ({
    rank: index + 1,
    channelId: entry.video.channelId,
    channelTitle: entry.channel?.title || entry.video.channelTitle,
    thumbnailUrl: entry.channel?.thumbnailUrl || entry.video.thumbnailUrl,
    category: category === 'Global' ? 'Global' : category,
    subscriberCount: entry.channel?.subscriberCount || 0,
    growthPercent: entry.growthPercent,
    aiQualityScore: entry.aiQualityScore,
    compositeScore: Math.round(entry.compositeScore * 100),
    sparkline: generateSparkline(entry.aiQualityScore + index * 3),
    videoId: entry.video.id,
    videoTitle: entry.video.title,
  }))
}
