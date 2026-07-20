import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { formatNumber } from '@/lib/utils'
import type { Video } from '@/types'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
  video: Video
  variant?: 'featured' | 'compact' | 'grid'
  category?: string
  insightScore?: number
  className?: string
}

export function ArticleCard({
  video,
  variant = 'grid',
  category,
  insightScore,
  className,
}: ArticleCardProps) {
  if (variant === 'featured') {
    return (
      <Link
        to={`/article/${video.id}`}
        className={cn(
          'md:col-span-8 row-span-2 group cursor-pointer relative rounded-xl overflow-hidden bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-border flex flex-col justify-end',
          className,
        )}
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
        </div>
        <div className="relative z-10 p-8">
          <div className="flex justify-between items-start mb-4">
            <Badge>{category || 'Featured'}</Badge>
            {insightScore != null && (
              <div className="bg-surface/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded flex items-center gap-1">
                <span className="material-symbols-outlined text-white text-xs">analytics</span>
                <span className="text-label-sm text-white">{insightScore} Insight Score</span>
              </div>
            )}
          </div>
          <h3 className="font-display text-headline-xl text-white mb-3 group-hover:text-gold transition-colors duration-300">
            {video.title}
          </h3>
          <p className="font-body text-body-md text-white/80 max-w-2xl line-clamp-2">
            {video.description}
          </p>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/article/${video.id}`}
        className={cn(
          'group cursor-pointer bg-surface rounded-xl border border-border overflow-hidden flex shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-transform duration-300',
          className,
        )}
      >
        <div className="w-2/5 relative overflow-hidden min-h-[120px]">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="w-3/5 p-5 flex flex-col justify-center">
          <Badge variant="gold" className="mb-2 w-fit">
            {category || 'Video'}
          </Badge>
          <h4 className="font-display text-headline-lg-mobile text-primary leading-tight mb-2 group-hover:text-gold transition-colors line-clamp-2">
            {video.title}
          </h4>
          <p className="text-label-sm text-muted line-clamp-2">{video.channelTitle}</p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/article/${video.id}`}
      className={cn('result-item flex flex-col gap-4 group cursor-pointer', className)}
    >
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-surface-container">
        <div className="absolute top-4 left-4 z-10">
          <Badge>{category || 'Analysis'}</Badge>
        </div>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-muted text-label-sm">
          <span>{video.channelTitle}</span>
          <span className="w-1 h-1 rounded-full bg-outline-variant" />
          <span>{formatNumber(video.viewCount)} views</span>
        </div>
        <h3 className="font-display text-headline-lg-mobile text-primary group-hover:text-gold transition-colors line-clamp-2">
          {video.title}
        </h3>
        <p className="font-body text-body-md text-on-surface-variant line-clamp-2">
          {video.description}
        </p>
      </div>
    </Link>
  )
}
