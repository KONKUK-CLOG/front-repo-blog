import { apiRequest } from "@/lib/api/client"
import type { Bookmark } from "@/lib/api/types"

export function fetchBookmarks() {
  return apiRequest<Bookmark[]>("/api/bookmarks", { auth: true })
}

export function addBookmark(blogId: number) {
  return apiRequest<Bookmark>("/api/bookmarks", { method: "POST", body: { blogId }, auth: true })
}

export function removeBookmark(bookmarkId: number) {
  return apiRequest<void>(`/api/bookmarks/${bookmarkId}`, { method: "DELETE", auth: true })
}
