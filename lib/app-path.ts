/** S3 정적 호스팅(Hash 라우터)용 경로 — 항상 /#/... 형태 */
export function appPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `/#${normalized}`
}

export function appUrl(path: string): string {
  if (typeof window === "undefined") return appPath(path)
  return `${window.location.origin}${appPath(path)}`
}
