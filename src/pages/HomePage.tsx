
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { ArrowRight, Eye, Loader2 } from "lucide-react"
import { fetchPublishedBlogs, fetchBlog } from "@/lib/api/blogs"
import type { BlogSummary } from "@/lib/api/types"
import BlogPostCard from "@/components/blog-post-card"
import { excerptFromContent } from "@/lib/format"
import { ApiError } from "@/lib/api/client"

export default function Home() {
  const [posts, setPosts] = useState<BlogSummary[]>([])
  const [meta, setMeta] = useState<Record<number, { excerpt: string }>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPublishedBlogs()
      .then(async (list) => {
        setError(null)
        const sorted = [...list].sort(
          (a, b) =>
            new Date(b.publishedAt ?? b.createdAt).getTime() -
            new Date(a.publishedAt ?? a.createdAt).getTime(),
        )
        setPosts(sorted)
        const recent = sorted.slice(0, 6)
        const m: Record<number, { excerpt: string }> = {}
        await Promise.all(
          recent.map(async (p) => {
            try {
              const d = await fetchBlog(p.id)
              m[p.id] = { excerpt: excerptFromContent(d.content) }
            } catch {
              m[p.id] = { excerpt: "" }
            }
          }),
        )
        setMeta(m)
      })
      .catch((e: unknown) => {
        setError(e instanceof ApiError ? e.message : "글 목록을 불러오지 못했습니다.")
      })
      .finally(() => setLoading(false))
  }, [])

  const recentPosts = posts.slice(0, 3)
  const popularPosts = [...posts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5)

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-background to-accent/10 px-4 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">CLOG</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground max-w-2xl">
            코딩하며 쌓은 기록을
            <span className="text-primary"> 블로그</span>로
          </h1>
          <p className="mt-6 text-lg text-foreground/70 md:text-xl max-w-xl leading-relaxed">
            Extension에서 작성한 글이 이곳에 발행됩니다. 읽고, 댓글 남기고, 북마크하세요.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:opacity-90 transition-opacity"
            >
              모든 글 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium hover:bg-secondary transition-colors"
            >
              소개
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="prose-heading text-2xl mb-8">최신 글</h2>
            {error ? (
              <div className="post-card text-center py-12 border-destructive/30 bg-destructive/5">
                <p className="text-destructive mb-2">{error}</p>
                <p className="text-sm text-muted-foreground">API: clog.r-e.kr · dev 서버 재시작 후 다시 시도해 주세요.</p>
              </div>
            ) : loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : recentPosts.length > 0 ? (
              <div className="space-y-6">
                {recentPosts.map((post) => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                    excerpt={meta[post.id]?.excerpt}
                    showBookmark
                  />
                ))}
              </div>
            ) : (
              <div className="post-card text-center py-12">
                <p className="text-muted-foreground mb-2">아직 발행된 글이 없습니다.</p>
                <p className="text-sm text-muted-foreground">Extension에서 글을 발행해 보세요.</p>
              </div>
            )}
          </div>

          <aside className="space-y-8">
            <div className="post-card">
              <h3 className="prose-heading text-lg mb-4">인기 글</h3>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : popularPosts.length > 0 ? (
                <ul className="space-y-3">
                  {popularPosts.map((post) => (
                    <li key={post.id}>
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-sm text-foreground/70 hover:text-primary transition-colors line-clamp-2"
                      >
                        {post.title}
                      </Link>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Eye className="h-3 w-3" />
                        {post.viewCount}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </div>

            <div className="post-card bg-gradient-to-br from-primary/5 to-transparent">
              <h3 className="prose-heading text-lg mb-3">시작하기</h3>
              <p className="prose-paragraph text-sm mb-4">
                GitHub로 로그인하면 글 작성·북마크·관리자 대시보드를 사용할 수 있습니다.
              </p>
              <Link to="/blog" className="text-sm font-medium text-primary hover:underline">
                블로그 둘러보기 →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
