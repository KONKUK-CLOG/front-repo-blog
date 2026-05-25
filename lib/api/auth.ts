import { apiRequest } from "@/lib/api/client"
import type { AuthResponse } from "@/lib/api/types"

/** 웹 OAuth — code → CLOG JWT */
export function exchangeGithubCode(code: string) {
  return apiRequest<AuthResponse>(`/api/auth/github/callback?code=${encodeURIComponent(code)}`)
}

/** VS Code Extension 전용 — 웹 블로그에서는 사용하지 않음 */
export function exchangeGithubAccessToken(githubAccessToken: string) {
  return apiRequest<AuthResponse>("/api/auth/github/token", {
    method: "POST",
    body: { githubAccessToken },
  })
}
