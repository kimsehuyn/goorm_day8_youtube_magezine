import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/contexts/LanguageContext'

export function ReaderGate() {
  const { login } = useAuth()
  const { t } = useTranslation()
  const [secretKey, setSecretKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(secretKey)
      setSecretKey('')
    } catch (err) {
      const status = (err as Error & { status?: number }).status
      setError(
        status === 503 ? t.auth.readerAuthNotConfigured : t.auth.readerLoginError,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-container-highest/40 to-background" />
      <div className="relative z-10 w-full max-w-lg text-center">
        <p className="text-label-md text-gold uppercase tracking-widest mb-4">
          YTMAG AI
        </p>
        <h1 className="font-display text-display-lg text-primary mb-4">
          {t.auth.readerGateTitle}
        </h1>
        <p className="text-body-lg text-muted mb-10 max-w-md mx-auto">
          {t.auth.readerGateDescription}
        </p>
        <form
          onSubmit={handleSubmit}
          className="bg-surface/80 backdrop-blur-xl border border-border rounded-xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)] text-left"
        >
          <label htmlFor="readerKey" className="text-label-sm text-muted uppercase tracking-wider block mb-2">
            {t.auth.readerKey}
          </label>
          <input
            id="readerKey"
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder={t.auth.readerKeyPlaceholder}
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface-container-lowest text-body-md focus:outline-none focus:border-gold mb-4"
            autoFocus
          />
          {error && (
            <p className="text-sm text-on-tertiary-container mb-4">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading || !secretKey.trim()}>
            {t.auth.readerEnter}
          </Button>
          <p className="text-label-sm text-muted mt-4 text-center">
            {t.auth.editorHint}
          </p>
        </form>
      </div>
    </div>
  )
}
