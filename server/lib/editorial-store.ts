import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import type { EditorialArticle } from './youtube.js'

export interface StoredEditorial {
  videoId: string
  lang: 'en' | 'ko'
  article: EditorialArticle
  updatedAt: string
  updatedBy: 'editor'
}

const memoryStore = new Map<string, StoredEditorial>()

function storageKey(videoId: string, lang: 'en' | 'ko'): string {
  return `${videoId}:${lang}`
}

function getStorePath(): string {
  const root = join(dirname(fileURLToPath(import.meta.url)), '../../data')
  return join(root, 'editorial-overrides.json')
}

function loadFromDisk(): void {
  try {
    const path = getStorePath()
    if (!existsSync(path)) return
    const raw = readFileSync(path, 'utf-8')
    const items = JSON.parse(raw) as StoredEditorial[]
    memoryStore.clear()
    for (const item of items) {
      memoryStore.set(storageKey(item.videoId, item.lang), item)
    }
  } catch {
    /* use in-memory only */
  }
}

function persistToDisk(): void {
  try {
    const path = getStorePath()
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, JSON.stringify([...memoryStore.values()], null, 2), 'utf-8')
  } catch {
    /* serverless or read-only fs */
  }
}

loadFromDisk()

export function getEditorialOverride(
  videoId: string,
  lang: 'en' | 'ko',
): StoredEditorial | null {
  return memoryStore.get(storageKey(videoId, lang)) ?? null
}

export function saveEditorialOverride(
  videoId: string,
  lang: 'en' | 'ko',
  article: EditorialArticle,
): StoredEditorial {
  const entry: StoredEditorial = {
    videoId,
    lang,
    article,
    updatedAt: new Date().toISOString(),
    updatedBy: 'editor',
  }
  memoryStore.set(storageKey(videoId, lang), entry)
  persistToDisk()
  return entry
}

export function deleteEditorialOverride(videoId: string, lang: 'en' | 'ko'): boolean {
  const key = storageKey(videoId, lang)
  const existed = memoryStore.has(key)
  memoryStore.delete(key)
  if (existed) persistToDisk()
  return existed
}

export function listEditorialOverrides(): StoredEditorial[] {
  return [...memoryStore.values()]
}
