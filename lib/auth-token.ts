import type { JwtClaims, UserResponse } from "@/lib/api/types"

const TOKEN_KEY = "clog_access_token"
const USER_KEY = "clog_user"

import { readPublicEnv } from "@/lib/env"

/** S3 정적 배포 시 API 직접 호출 (기본: https://clog.r-e.kr) */
export function getApiBaseUrl(): string {
  return readPublicEnv("API_BASE_URL") ?? "https://clog.r-e.kr"
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function parseJwtClaims(token: string): JwtClaims | null {
  try {
    const payload = token.split(".")[1]
    if (!payload) return null
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(json) as JwtClaims
  } catch {
    return null
  }
}

export function userFromClaims(claims: JwtClaims): UserResponse {
  const id = Number(claims.sub)
  const nickname = claims.nickname ?? "user"
  return {
    id,
    name: nickname,
    nickname,
    email: claims.email ?? "",
    socialId: "",
    createdAt: "",
    updatedAt: "",
  }
}

export function getStoredUser(): UserResponse | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserResponse
  } catch {
    return null
  }
}

export function setStoredUser(user: UserResponse): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function avatarUrl(user: UserResponse): string {
  if (user.socialId?.startsWith("github-")) {
    const ghId = user.socialId.replace("github-", "")
    return `https://avatars.githubusercontent.com/u/${ghId}?s=80`
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nickname || user.name)}&background=f97316&color=fff`
}
