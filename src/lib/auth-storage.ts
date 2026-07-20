const TOKEN_KEY = 'ytmag-auth-token'
const EXPIRES_KEY = 'ytmag-auth-expires'
const ROLE_KEY = 'ytmag-auth-role'

export function getAuthToken(): string | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const expires = localStorage.getItem(EXPIRES_KEY)
    if (!token || !expires) return null
    if (Date.now() > new Date(expires).getTime()) {
      clearAuthSession()
      return null
    }
    return token
  } catch {
    return null
  }
}

export function getStoredRole(): 'reader' | 'editor' | null {
  const role = localStorage.getItem(ROLE_KEY)
  if (role === 'reader' || role === 'editor') return role
  return null
}

export function setAuthSession(
  token: string,
  expiresAt: string,
  role: 'reader' | 'editor',
): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(EXPIRES_KEY, expiresAt)
  localStorage.setItem(ROLE_KEY, role)
}

export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EXPIRES_KEY)
  localStorage.removeItem(ROLE_KEY)
}

export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Legacy aliases
export const getEditorToken = getAuthToken
export const setEditorSession = (token: string, expiresAt: string) =>
  setAuthSession(token, expiresAt, 'editor')
export const clearEditorSession = clearAuthSession
