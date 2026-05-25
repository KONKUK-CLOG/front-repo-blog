
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Bookmark, Loader2, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { fetchBookmarks, removeBookmark } from "@/lib/api/bookmarks"
import type { Bookmark as BookmarkType } from "@/lib/api/types"
import { formatDate } from "@/lib/format"

export default function BookmarksPage() {
  const { user, isReady } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<BookmarkType[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      setItems(await fetchBookmarks())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isReady) return
    if (!user) {
      navigate("/")
      return
    }
    load()
  }, [user, isReady, navigate])

  if (!isReady || !user) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="prose-heading text-4xl mb-2 flex items-center gap-2">
        <Bookmark className="h-9 w-9 text-primary" />
        북마크
      </h1>
      <p className="text-muted-foreground mb-8">저장한 글 목록</p>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="post-card text-center py-12">
          <p className="text-muted-foreground mb-4">북마크한 글이 없습니다.</p>
          <Link to="/blog" className="text-primary hover:underline text-sm">
            블로그 둘러보기
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="post-card flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Link
                  to={`/blog/${item.blog.id}`}
                  className="prose-heading text-lg hover:text-primary line-clamp-1"
                >
                  {item.blog.title}
                </Link>
                <p className="text-xs text-muted-foreground mt-1">
                  저장 · {formatDate(item.createdAt)} · 조회 {item.blog.viewCount}
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await removeBookmark(item.id)
                  load()
                }}
                className="p-2 text-destructive hover:bg-destructive/10 rounded shrink-0"
                aria-label="북마크 해제"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
