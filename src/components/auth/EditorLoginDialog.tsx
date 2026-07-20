import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'

interface EditorLoginDialogProps {
  open: boolean
  onClose: () => void
}

export function EditorLoginDialog({ open, onClose }: EditorLoginDialogProps) {
  const { login } = useAuth()
  const { t } = useTranslation()
  const [secretKey, setSecretKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(secretKey)
      setSecretKey('')
      onClose()
    } catch {
      setError(t.auth.loginError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface rounded-xl border border-border shadow-[0_20px_40px_rgba(0,0,0,0.12)] p-8">
        <h2 className="font-display text-headline-lg text-primary mb-2">{t.auth.loginTitle}</h2>
        <p className="text-body-md text-muted mb-6">{t.auth.loginDescription}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="secretKey" className="text-label-sm text-muted uppercase tracking-wider block mb-2">
              {t.auth.secretKey}
            </label>
            <input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder={t.auth.secretKeyPlaceholder}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface-container-lowest text-body-md focus:outline-none focus:border-gold"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-on-tertiary-container">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              {t.auth.cancelEdit}
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || !secretKey.trim()}>
              {t.auth.loginSubmit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface RoleBadgeProps {
  className?: string
}

export function RoleBadge({ className }: RoleBadgeProps) {
  const { isEditor } = useAuth()
  const { t } = useTranslation()

  return (
    <span
      className={cn(
        'text-label-sm px-2 py-0.5 rounded-full uppercase tracking-wider',
        isEditor
          ? 'bg-gold/15 text-gold border border-gold/30'
          : 'bg-surface-container text-muted border border-border',
        className,
      )}
    >
      {isEditor ? t.auth.editorBadge : t.auth.reader}
    </span>
  )
}
