import { cn } from '@/lib/utils'

interface AISummaryWidgetProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function AISummaryWidget({
  title = 'AI Summary',
  children,
  className,
}: AISummaryWidgetProps) {
  return (
    <div className={cn('ai-widget rounded-xl p-8 relative overflow-hidden', className)}>
      <div className="absolute top-4 right-4 text-gold opacity-50">
        <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
      </div>
      <h3 className="font-display text-headline-lg text-primary mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-gold">smart_toy</span>
        {title}
      </h3>
      <div className="font-body text-body-md text-on-surface-variant">{children}</div>
    </div>
  )
}
