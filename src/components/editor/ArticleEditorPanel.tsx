import { useState } from 'react'
import type { EditorialArticle } from '@/types'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/contexts/LanguageContext'

interface ArticleEditorPanelProps {
  article: EditorialArticle
  onSave: (article: EditorialArticle) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}

export function ArticleEditorPanel({
  article,
  onSave,
  onCancel,
  isSaving,
}: ArticleEditorPanelProps) {
  const { t } = useTranslation()
  const [form, setForm] = useState<EditorialArticle>({ ...article })

  const updateInsight = (index: number, field: 'title' | 'body', value: string) => {
    const keyInsights = [...form.keyInsights]
    keyInsights[index] = { ...keyInsights[index], [field]: value }
    setForm({ ...form, keyInsights })
  }

  const handleSave = () => {
    onSave(form)
  }

  return (
    <div className="space-y-6 p-6 bg-surface border border-gold/30 rounded-xl">
      <h3 className="font-display text-headline-lg text-primary">{t.auth.editArticle}</h3>

      <Field label={t.auth.headline}>
        <input
          value={form.headline}
          onChange={(e) => setForm({ ...form, headline: e.target.value })}
          className="editor-input"
        />
      </Field>

      <Field label={t.auth.summary}>
        <textarea
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          rows={3}
          className="editor-input"
        />
      </Field>

      <Field label={t.auth.whyItMatters}>
        <textarea
          value={form.whyItMatters}
          onChange={(e) => setForm({ ...form, whyItMatters: e.target.value })}
          rows={3}
          className="editor-input"
        />
      </Field>

      <Field label={t.auth.aiOpinion}>
        <textarea
          value={form.aiOpinion}
          onChange={(e) => setForm({ ...form, aiOpinion: e.target.value })}
          rows={3}
          className="editor-input"
        />
      </Field>

      <Field label={t.auth.audience}>
        <textarea
          value={form.audience}
          onChange={(e) => setForm({ ...form, audience: e.target.value })}
          rows={2}
          className="editor-input"
        />
      </Field>

      <Field label={t.auth.category}>
        <input
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="editor-input"
        />
      </Field>

      <Field label={t.auth.editorialBody}>
        <textarea
          value={(form.editorialBody || []).join('\n\n')}
          onChange={(e) =>
            setForm({
              ...form,
              editorialBody: e.target.value.split('\n\n').filter(Boolean),
            })
          }
          rows={6}
          className="editor-input"
        />
      </Field>

      {form.keyInsights.map((insight, index) => (
        <div key={index} className="space-y-2 p-4 bg-surface-container-low rounded-lg">
          <Field label={`${t.auth.keyInsightTitle} ${index + 1}`}>
            <input
              value={insight.title}
              onChange={(e) => updateInsight(index, 'title', e.target.value)}
              className="editor-input"
            />
          </Field>
          <Field label={t.auth.keyInsightBody}>
            <textarea
              value={insight.body}
              onChange={(e) => updateInsight(index, 'body', e.target.value)}
              rows={2}
              className="editor-input"
            />
          </Field>
        </div>
      ))}

      <div className="flex flex-wrap gap-3 pt-4">
        <Button onClick={handleSave} disabled={isSaving}>
          {t.auth.saveArticle}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          {t.auth.cancelEdit}
        </Button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-label-sm text-muted uppercase tracking-wider block mb-2">{label}</label>
      {children}
    </div>
  )
}
