import { randomUUID } from 'crypto'

export type UserRole = 'reader' | 'editor'

interface Session {
  role: UserRole
  expiresAt: number
}

const sessions = new Map<string, Session>()
const SESSION_TTL_MS = 24 * 60 * 60 * 1000

export function getEditorSecretKey(): string {
  const key = process.env.EDITOR_SECRET_KEY
  if (!key) throw new Error('EDITOR_SECRET_KEY is not configured')
  return key
}

export function getReaderSecretKey(): string {
  const key = process.env.READER_SECRET_KEY
  if (!key) throw new Error('READER_SECRET_KEY is not configured')
  return key
}

export function isEditorAuthConfigured(): boolean {
  return Boolean(process.env.EDITOR_SECRET_KEY?.trim())
}

export function isReaderAuthConfigured(): boolean {
  return Boolean(process.env.READER_SECRET_KEY?.trim())
}

function createSession(role: UserRole) {
  const token = randomUUID()
  const expiresAt = Date.now() + SESSION_TTL_MS
  sessions.set(token, { role, expiresAt })
  return { token, role, expiresAt: new Date(expiresAt).toISOString() }
}

export function loginWithSecretKey(
  secretKey: string,
): { token: string; role: UserRole; expiresAt: string } | null {
  if (isEditorAuthConfigured() && secretKey === getEditorSecretKey()) {
    return createSession('editor')
  }
  if (isReaderAuthConfigured() && secretKey === getReaderSecretKey()) {
    return createSession('reader')
  }
  return null
}

export function loginEditor(secretKey: string) {
  if (!isEditorAuthConfigured() || secretKey !== getEditorSecretKey()) return null
  return createSession('editor')
}

export function loginReader(secretKey: string) {
  if (!isReaderAuthConfigured() || secretKey !== getReaderSecretKey()) return null
  return createSession('reader')
}

function getSession(authHeader?: string): Session | null {
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  const session = sessions.get(token)
  if (!session) return null
  if (Date.now() > session.expiresAt) {
    sessions.delete(token)
    return null
  }
  return session
}

export function verifyEditorToken(authHeader?: string): boolean {
  const session = getSession(authHeader)
  return session?.role === 'editor'
}

export function verifyReaderToken(authHeader?: string): boolean {
  const session = getSession(authHeader)
  return session?.role === 'reader' || session?.role === 'editor'
}

export function logoutSession(authHeader?: string): void {
  if (!authHeader?.startsWith('Bearer ')) return
  sessions.delete(authHeader.slice(7))
}

export function getRoleFromToken(authHeader?: string): UserRole | null {
  return getSession(authHeader)?.role ?? null
}
