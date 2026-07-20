import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '@/lib/api'
import {
  clearAuthSession,
  getAuthToken,
  setAuthSession,
} from '@/lib/auth-storage'
import type { UserRole } from '@/types'

interface AuthContextValue {
  role: UserRole | null
  isAuthenticated: boolean
  isEditor: boolean
  isReader: boolean
  isLoading: boolean
  login: (secretKey: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshRole = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      setRole(null)
      return
    }
    try {
      const { role: serverRole, authenticated } = await api.authMe()
      setRole(authenticated ? serverRole : null)
    } catch {
      clearAuthSession()
      setRole(null)
    }
  }, [])

  useEffect(() => {
    refreshRole().finally(() => setIsLoading(false))
  }, [refreshRole])

  const login = useCallback(async (secretKey: string) => {
    const session = await api.authLogin(secretKey)
    setAuthSession(session.token, session.expiresAt, session.role)
    setRole(session.role)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.authLogout()
    } finally {
      clearAuthSession()
      setRole(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      role,
      isAuthenticated: role !== null,
      isEditor: role === 'editor',
      isReader: role === 'reader' || role === 'editor',
      isLoading,
      login,
      logout,
    }),
    [role, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
