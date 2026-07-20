import type { EditorialArticle, Video } from './youtube.js'
import { getOpenAIKey } from './youtube.js'

const editorialSchema = {
  name: 'editorial_article',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      headline: { type: 'string' },
      summary: { type: 'string' },
      whyItMatters: { type: 'string' },
      keyInsights: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            body: { type: 'string' },
          },
          required: ['title', 'body'],
          additionalProperties: false,
        },
      },
      aiOpinion: { type: 'string' },
      audience: { type: 'string' },
      keyQuotes: { type: 'array', items: { type: 'string' } },
      category: { type: 'string' },
      qualityScore: { type: 'number' },
      editorialBody: { type: 'array', items: { type: 'string' } },
    },
    required: [
      'headline',
      'summary',
      'whyItMatters',
      'keyInsights',
      'aiOpinion',
      'audience',
      'keyQuotes',
      'category',
      'qualityScore',
      'editorialBody',
    ],
    additionalProperties: false,
  },
}

function buildPrompt(video: Video, lang: 'en' | 'ko' = 'en'): string {
  const languageInstruction =
    lang === 'ko'
      ? 'Write ALL text content in Korean (한국어). Use a premium magazine tone suitable for Korean readers.'
      : 'Write in an editorial GQ/Esquire tone in English.'

  const categoryList =
    lang === 'ko'
      ? 'Technology, AI, Finance, Lifestyle, Gaming, Travel, Music, Design, Culture (return category key in English)'
      : 'Technology, AI, Finance, Lifestyle, Gaming, Travel, Music, Design, Culture'

  return `You are the AI editor of YTMAG AI, a premium digital magazine covering YouTube culture.
Transform this YouTube video into a magazine article. ${languageInstruction}

Video Title: ${video.title}
Channel: ${video.channelTitle}
Views: ${video.viewCount}
Likes: ${video.likeCount}
Comments: ${video.commentCount}
Published: ${video.publishedAt}
Tags: ${video.tags.slice(0, 10).join(', ')}

Description:
${video.description.slice(0, 2000)}

Requirements:
- headline: compelling magazine headline (not the raw YouTube title)
- summary: 3-sentence executive summary
- whyItMatters: why this video matters now
- keyInsights: 2-4 insight cards with title and body
- aiOpinion: editor's comment (2-3 sentences, opinionated)
- audience: who should watch this
- keyQuotes: 1-2 pull quotes derived from the content
- category: one of ${categoryList}
- qualityScore: 0-100 quality assessment
- editorialBody: 3-4 paragraphs of magazine prose expanding on the video`
}

export async function generateEditorial(
  video: Video,
  lang: 'en' | 'ko' = 'en',
): Promise<EditorialArticle> {
  const systemMessage =
    lang === 'ko'
      ? 'You are a world-class magazine editor fluent in Korean. Respond only with valid JSON matching the schema. All string values must be in Korean except the category field which must remain in English.'
      : 'You are a world-class magazine editor. Respond only with valid JSON matching the schema.'

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getOpenAIKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        { role: 'user', content: buildPrompt(video, lang) },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: editorialSchema,
      },
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`OpenAI API error: ${response.status} ${text}`)
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[]
  }
  const content = data.choices[0]?.message?.content
  if (!content) throw new Error('Empty OpenAI response')

  return JSON.parse(content) as EditorialArticle
}

export async function estimateQualityScore(video: Video): Promise<number> {
  const engagement =
    video.viewCount > 0
      ? ((video.likeCount + video.commentCount) / video.viewCount) * 1000
      : 0
  const base = Math.min(95, 60 + engagement * 5 + Math.min(video.tags.length * 2, 10))
  return Math.round(base)
}
