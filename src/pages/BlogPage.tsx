
import { useEffect, useState } from "react"
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { fetchPublishedBlogs, fetchBlog } from "@/lib/api/blogs"
import type { BlogSummary } from "@/lib/api/types"
import BlogPostCard from "@/components/blog-post-card"
import { excerptFromContent, estimateReadTime } from "@/lib/format"
import { ApiError } from "@/lib/api/client"

const POSTS_PER_PAGE = 8

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogSummary[]>([])
  const [meta, setMeta] = useState<Record<number, { excerpt: string; readTime: string }>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchPublishedBlogs()
      .then(async (list) => {
        setError(null)
        setPosts(list)
        const map: Record<number, { excerpt: string; readTime: string }> = {}
        await Promise.all(
          list.slice(0, 20).map(async (p) => {
            try {
              const detail = await fetchBlog(p.id)
              map[p.id] = {
                excerpt: excerptFromContent(detail.content),
                readTime: estimateReadTime(detail.content),
              }
            } catch {
              map[p.id] = { excerpt: "", readTime: "" }
            }
          }),
        )
        setMeta(map)
      })
      .catch((e: unknown) => {
        setError(e instanceof ApiError ? e.message : "글 목록을 불러오지 못했습니다.")
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE))
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="prose-heading text-4xl mb-2">블로그</h1>
        <p className="text-foreground/70">
          CLOG에 발행된 공개 글 · 총 {loading ? "…" : filteredPosts.length}개
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="제목 검색..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-lg border border-border bg-card px-10 py-2 outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {error ? (
            <div className="post-card text-center py-12 border-destructive/30 bg-destructive/5">
              <p className="text-destructive">{error}</p>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : paginatedPosts.length > 0 ? (
            <div className="space-y-6">
              {paginatedPosts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  excerpt={meta[post.id]?.excerpt}
                  readTime={meta[post.id]?.readTime}
                />
              ))}
            </div>
          ) : (
            <div className="post-card text-center py-12">
              <p className="text-muted-foreground">표시할 글이 없습니다.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </button>
              <span className="text-sm text-muted-foreground">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-50"
              >
                다음
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <aside className="post-card h-fit space-y-4">
          <h3 className="prose-heading text-lg">CLOG 블로그</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            VS Code Extension과 연동된 개발 블로그입니다. 공개된 글을 읽고 댓글·북마크로 소통해 보세요.
          </p>
          <p className="text-xs text-muted-foreground">
            API: <code className="bg-muted px-1 rounded">/api/blogs/published</code>
          </p>
        </aside>
      </div>
    </div>
  )
}
