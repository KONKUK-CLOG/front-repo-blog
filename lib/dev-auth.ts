/**
 * 로컬 개발 전용 자동 로그인 토큰.
 * 프로덕션(S3) 빌드에는 절대 적용하지 않음 — 모든 방문자가 같은 계정이 되는 문제 방지.
 */
export function getDevAutoLoginToken(): string | undefined {
  const isViteDev = import.meta.env.DEV
  const isNextDev =
    typeof process !== "undefined" && process.env.NODE_ENV === "development"

  if (!isViteDev && !isNextDev) return undefined

  const candidates = [
    import.meta.env?.VITE_DEV_CLOG_TOKEN,
    typeof process !== "undefined" ? process.env.NEXT_PUBLIC_DEV_CLOG_TOKEN : undefined,
  ]

  const token = candidates.map((t) => t?.trim()).find((t) => t?.startsWith("eyJ"))
  return token
}
