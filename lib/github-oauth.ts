import { readPublicEnv } from "@/lib/env"

/** sessionStorage 키 — OAuth state(CSRF) */
export const OAUTH_STATE_KEY = "clog_oauth_state"

const DEFAULT_S3_ORIGIN =
  "http://clog-frontend-project.s3-website.ap-northeast-2.amazonaws.com"

/**
 * OAuth state용 랜덤 ID.
 * S3 정적 웹사이트는 http:// 이라 crypto.randomUUID()가 없음(secure context 필요).
 */
function generateOAuthStateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }

  return `clog-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
}

/** GitHub OAuth App에 등록한 callback URL과 동일 (끝 `/` 없음, `#` 없음) */
export function getOAuthRedirectUri(): string {
  const fromEnv = readPublicEnv("OAUTH_REDIRECT_URI")
  if (fromEnv) return fromEnv.replace(/\/$/, "")
  if (typeof window !== "undefined") return window.location.origin
  return DEFAULT_S3_ORIGIN
}

export function getGithubClientId(): string {
  const id = readPublicEnv("GITHUB_CLIENT_ID")
  if (!id) {
    throw new Error(
      "GITHUB_CLIENT_ID가 설정되지 않았습니다. .env.local에 VITE_GITHUB_CLIENT_ID 또는 NEXT_PUBLIC_GITHUB_CLIENT_ID를 넣어 주세요.",
    )
  }
  return id
}

export function createOAuthState(): string {
  const state = generateOAuthStateId()
  sessionStorage.setItem(OAUTH_STATE_KEY, state)
  return state
}

/** callback에서 state 일치 여부만 확인 (제거는 JWT 교환 성공 후) */
export function verifyOAuthState(received: string | null): boolean {
  const saved = sessionStorage.getItem(OAUTH_STATE_KEY)
  return !!(received && saved && received === saved)
}

export function clearOAuthState(): void {
  sessionStorage.removeItem(OAUTH_STATE_KEY)
}

/** S3 루트(/?code=) 또는 hash 라우트(#/…?code=) 쿼리 파싱 */
export function parseOAuthQuery(): { code: string | null; state: string | null } {
  const root = new URLSearchParams(window.location.search)
  const rootCode = root.get("code")
  if (rootCode) {
    return { code: rootCode, state: root.get("state") }
  }

  const hash = window.location.hash
  const q = hash.indexOf("?")
  if (q === -1) return { code: null, state: null }

  const hashParams = new URLSearchParams(hash.slice(q + 1))
  return { code: hashParams.get("code"), state: hashParams.get("state") }
}

export function clearOAuthQueryFromUrl(): void {
  window.history.replaceState(
    null,
    "",
    `${window.location.origin}${window.location.pathname}${window.location.hash.split("?")[0]}`,
  )
}

export function buildGithubAuthorizeUrl(): string {
  const params = new URLSearchParams({
    client_id: getGithubClientId(),
    redirect_uri: getOAuthRedirectUri(),
    scope: "read:user user:email",
    state: createOAuthState(),
  })
  return `https://github.com/login/oauth/authorize?${params.toString()}`
}

/** GitHub authorize 페이지로 이동 */
export function startGithubOAuth(): void {
  window.location.href = buildGithubAuthorizeUrl()
}
