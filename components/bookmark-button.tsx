"use client"

import { useState, useEffect, useCallback } from "react"
import { Bookmark } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { addBookmark, fetchBookmarks, removeBookmark } from "@/lib/api/bookmarks"
import { ApiError } from "@/lib/api/client"

interface BookmarkButtonProps {
  blogId: number
}

export default function BookmarkButton({ blogId }: BookmarkButtonProps) {
  const { user, login } = useAuth()
  const [bookmarkId, setBookmarkId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!user) return
    try {
      const list = await fetchBookmarks()
      const found = list.find((b) => b.blog.id === blogId)
      setBookmarkId(found?.id ?? null)
    } catch {
      setBookmarkId(null)
    }
  }, [user, blogId])

  useEffect(() => {
    load()
  }, [load])

  const toggle = async () => {
    if (!user) {
      login()
      return
    }
    setLoading(true)
    try {
      if (bookmarkId) {
        await removeBookmark(bookmarkId)
        setBookmarkId(null)
      } else {
        const created = await addBookmark(blogId)
        setBookmarkId(created.id)
      }
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        await load()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
        bookmarkId
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-secondary text-foreground hover:bg-secondary/80"
      }`}
      aria-pressed={!!bookmarkId}
    >
      <Bookmark className={`h-4 w-4 ${bookmarkId ? "fill-current" : ""}`} />
      {bookmarkId ? "북마크됨" : "북마크"}
    </button>
  )
}
