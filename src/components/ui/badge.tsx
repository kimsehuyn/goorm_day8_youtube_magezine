import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'accent'
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm',
        variant === 'default' && 'bg-surface text-primary',
        variant === 'gold' && 'bg-gold/10 border border-gold/30 text-gold',
        variant === 'accent' && 'text-on-tertiary-container',
        className,
      )}
      {...props}
    />
  )
}
