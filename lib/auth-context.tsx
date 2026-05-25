"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { exchangeGithubCode } from "@/lib/api/auth"
import { fetchCurrentUser } from "@/lib/api/users"
import type { UserResponse } from "@/lib/api/types"
import {
  avatarUrl,
  clearStoredToken,
  getStoredToken,
  getStoredUser,
  parseJwtClaims,
  setStoredToken,
  setStoredUser,
  userFromClaims,
} from "@/lib/auth-token"
import { getDevAutoLoginToken } from "@/lib/dev-auth"
import { startGithubOAuth } from "@/lib/github-oauth"

interface AuthContextType {
  user: UserResponse | null
  isLoading: boolean
  isReady: boolean
  /** GitHub OAuth authorize 페이지로 이동 */
  login: () => void
  logout: () => void
  /** GET /api/auth/github/callback?code= → CLOG JWT */
  completeOAuth: (code: string) => Promise<void>
  refreshProfile: () => Promise<void>
  getAvatar: (u?: UserResponse | null) => string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const refreshProfile = useCallback(async () => {
    const token = getStoredToken()
    if (!token) {
      setUser(null)
      return
    }
    const claims = parseJwtClaims(token)
    if (!claims?.sub) {
      clearStoredToken()
      setUser(null)
      return
    }
    try {
      const profile = await fetchCurrentUser(Number(claims.sub))
      setUser(profile)
      setStoredUser(profile)
    } catch {
      const fallback = getStoredUser() ?? userFromClaims(claims)
      setUser(fallback)
    }
  }, [])

  const applyAuthToken = useCallback(
    async (accessToken: string) => {
      setStoredToken(accessToken)
      const claims = parseJwtClaims(accessToken)
      if (claims) {
        const initial = userFromClaims(claims)
        setUser(initial)
        setStoredUser(initial)
      }
      await refreshProfile()
    },
    [refreshProfile],
  )

  useEffect(() => {
    let cancelled = false

    const finish = () => {
      if (!cancelled) setIsReady(true)
    }

    const bootstrap = async () => {
      if (getStoredToken()) {
        const cached = getStoredUser()
        if (cached) setUser(cached)
        await refreshProfile().catch(() => {})
        finish()
        return
      }

      const devToken = getDevAutoLoginToken()
      if (devToken) {
        try {
          await applyAuthToken(devToken)
        } catch {
          /* ignore */
        }
      }

      finish()
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [refreshProfile, applyAuthToken])

  const login = useCallback(() => {
    try {
      startGithubOAuth()
    } catch (e) {
      const message = e instanceof Error ? e.message : "GitHub 로그인 설정 오류"
      alert(message)
    }
  }, [])

  const completeOAuth = useCallback(
    async (code: string) => {
      setIsLoading(true)
      try {
        const { accessToken } = await exchangeGithubCode(code)
        await applyAuthToken(accessToken)
      } finally {
        setIsLoading(false)
      }
    },
    [applyAuthToken],
  )

  const logout = useCallback(() => {
    clearStoredToken()
    setUser(null)
  }, [])

  const getAvatar = useCallback(
    (u?: UserResponse | null) => {
      const target = u ?? user
      if (!target) return "/placeholder.svg"
      return avatarUrl(target)
    },
    [user],
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isReady,
        login,
        logout,
        completeOAuth,
        refreshProfile,
        getAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
