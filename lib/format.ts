export function formatDate(iso: string | null | undefined): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

export function excerptFromContent(content: string, maxLen = 140): string {
  const text = stripHtml(content)
  if (text.length <= maxLen) return text
  return `${text.slice(0, maxLen)}…`
}

export function estimateReadTime(content: string): string {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes}분`
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    DRAFT: "초안",
    PUBLISHED: "발행",
    DELETED: "삭제",
  }
  return map[status] ?? status
}

export function visibilityLabel(v: string): string {
  const map: Record<string, string> = {
    PUBLIC: "공개",
    PRIVATE: "비공개",
    LINKED: "링크 공유",
  }
  return map[v] ?? v
}
