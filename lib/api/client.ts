import { getApiBaseUrl, getStoredToken } from "@/lib/auth-token"
import type { ApiResponse } from "@/lib/api/types"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
  auth?: boolean
  withToken?: boolean
}

function connectionHint(status: number): string {
  if (status === 0 || status === 502 || status === 503 || status === 504) {
    return " API 서버(https://clog.r-e.kr) 연결을 확인해 주세요."
  }
  return ""
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, auth = false, withToken = false, headers: customHeaders, ...rest } = options
  const headers = new Headers(customHeaders)

  if (body !== undefined) {
    headers.set("Content-Type", "application/json")
  }

  const token = getStoredToken()
  if (auth) {
    if (!token) throw new ApiError("로그인이 필요합니다.", 401)
    headers.set("Authorization", `Bearer ${token}`)
  } else if (withToken && token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  let res: Response
  try {
    res = await fetch(`${getApiBaseUrl()}${path}`, {
      ...rest,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(`네트워크 오류가 발생했습니다.${connectionHint(0)}`, 0)
  }

  if (res.status === 429) {
    const rateLimited = await res.json().catch(() => ({}))
    throw new ApiError(
      (rateLimited as { message?: string }).message ?? "요청 한도를 초과했습니다.",
      429,
    )
  }

  const text = await res.text()
  let json: ApiResponse<T> | null = null

  if (text) {
    try {
      json = JSON.parse(text) as ApiResponse<T>
    } catch {
      throw new ApiError(
        `서버 응답을 JSON으로 읽을 수 없습니다 (${res.status}).${connectionHint(res.status)}`,
        res.status,
      )
    }
  } else if (res.ok) {
    return undefined as T
  } else {
    throw new ApiError(`서버 응답이 비어 있습니다 (${res.status}).${connectionHint(res.status)}`, res.status)
  }

  if (!res.ok || !json.success) {
    throw new ApiError(json.error ?? `요청에 실패했습니다 (${res.status}).`, res.status)
  }

  return json.data as T
}
