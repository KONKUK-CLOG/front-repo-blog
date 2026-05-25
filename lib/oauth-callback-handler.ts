import { ApiError } from "@/lib/api/client"
import {
  clearOAuthQueryFromUrl,
  clearOAuthState,
  parseOAuthQuery,
  verifyOAuthState,
} from "@/lib/github-oauth"

export const OAUTH_ERROR_KEY = "clog_oauth_error"

const PROCESSED_CODE_PREFIX = "clog_oauth_code_done:"

let inflightCode: string | null = null
let inflightPromise: Promise<OAuthCallbackResult> | null = null

function formatOAuthExchangeError(e: unknown): string {
  if (e instanceof ApiError) {
    const hint =
      e.status === 500 || e.status === 502
        ? " 백엔드(GitHub Client Secret·redirect_uri) 설정을 확인하고, 「GitHub 로그인」을 다시 시도해 주세요."
        : ""
    return `${e.message}${hint}`
  }
  if (e instanceof Error) return e.message
  return "GitHub 로그인에 실패했습니다."
}

export type OAuthCallbackResult =
  | { status: "none" }
  | { status: "success" }
  | { status: "error"; message: string }

/** URL의 ?code= 처리 — state 검증 후 JWT 교환은 completeOAuth에 위임 */
export async function handleOAuthCallback(
  exchangeCode: (code: string) => Promise<void>,
): Promise<OAuthCallbackResult> {
  const { code, state } = parseOAuthQuery()
  if (!code) return { status: "none" }

  if (inflightCode === code && inflightPromise) {
    return inflightPromise
  }

  inflightCode = code
  inflightPromise = runOAuthExchange(code, state, exchangeCode).finally(() => {
    inflightCode = null
    inflightPromise = null
  })

  return inflightPromise
}

async function runOAuthExchange(
  code: string,
  state: string | null,
  exchangeCode: (code: string) => Promise<void>,
): Promise<OAuthCallbackResult> {
  const doneKey = `${PROCESSED_CODE_PREFIX}${code}`
  if (sessionStorage.getItem(doneKey)) {
    clearOAuthQueryFromUrl()
    return { status: "none" }
  }

  if (!verifyOAuthState(state)) {
    clearOAuthQueryFromUrl()
    return {
      status: "error",
      message:
        "OAuth state 검증에 실패했습니다. GitHub 로그인 버튼으로 다시 시도해 주세요. (새 탭·다른 브라우저에서 열면 실패할 수 있습니다.)",
    }
  }

  try {
    await exchangeCode(code)
    clearOAuthState()
    clearOAuthQueryFromUrl()
    sessionStorage.setItem(doneKey, "1")
    return { status: "success" }
  } catch (e) {
    clearOAuthQueryFromUrl()
    clearOAuthState()
    return { status: "error", message: formatOAuthExchangeError(e) }
  }
}

export function stashOAuthError(message: string): void {
  sessionStorage.setItem(OAUTH_ERROR_KEY, message)
}

export function takeOAuthError(): string | null {
  const msg = sessionStorage.getItem(OAUTH_ERROR_KEY)
  if (msg) sessionStorage.removeItem(OAUTH_ERROR_KEY)
  return msg
}
