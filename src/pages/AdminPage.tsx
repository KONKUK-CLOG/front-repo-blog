
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { useAuth } from "@/lib/auth-context"
import { Trash2, Edit2, Plus, Send, Loader2, ExternalLink } from "lucide-react"
import PostForm from "@/components/post-form"
import { deleteBlog, fetchBlog, fetchUserBlogs, publishBlog, updateBlog } from "@/lib/api/blogs"
import type { BlogSummary } from "@/lib/api/types"
import { formatDate, statusLabel, visibilityLabel } from "@/lib/format"

export default function AdminPage() {
  const navigate = useNavigate()
  const { user, isReady } = useAuth()
  const [posts, setPosts] = useState<BlogSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const list = await fetchUserBlogs(user.id)
      setPosts(list)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!isReady) return
    if (!user) {
      navigate("/")
      return
    }
    load()
  }, [user, isReady, load, navigate])

  if (!isReady || !user) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="prose-heading text-4xl">내 글 관리</h1>
          <p className="text-muted-foreground mt-1">{user.nickname}님의 블로그</p>
        </div>
        <button
          onClick={() => {
            setEditingBlogId(null)
            setShowForm(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          새 글 작성
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <PostForm
            editingBlogId={editingBlogId}
            onClose={() => {
              setShowForm(false)
              setEditingBlogId(null)
            }}
            onSaved={load}
          />
        </div>
      )}

      <div className="post-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">작성한 글이 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">제목</th>
                  <th className="px-6 py-3 text-left font-semibold">상태</th>
                  <th className="px-6 py-3 text-left font-semibold">공개</th>
                  <th className="px-6 py-3 text-left font-semibold">조회</th>
                  <th className="px-6 py-3 text-left font-semibold">날짜</th>
                  <th className="px-6 py-3 text-right font-semibold">작업</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-border hover:bg-secondary/30">
                    <td className="px-6 py-4 max-w-xs truncate">{post.title}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-0.5 rounded bg-muted">
                        {statusLabel(post.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground">{visibilityLabel(post.visibility)}</span>
                      {post.status === "PUBLISHED" && post.visibility !== "PUBLIC" && (
                        <span className="block text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                          피드 미노출
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{post.viewCount}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(post.publishedAt ?? post.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        {post.status === "PUBLISHED" && (
                          <Link
                            to={`/blog/${post.id}`}
                            className="p-2 text-muted-foreground hover:text-primary rounded"
                            title="보기"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                        {post.status === "DRAFT" && (
                          <button
                            onClick={async () => {
                              const detail = await fetchBlog(post.id)
                              await updateBlog(post.id, {
                                title: detail.title,
                                content: detail.content,
                                visibility: "PUBLIC",
                              })
                              await publishBlog(post.id)
                              load()
                            }}
                            className="p-2 text-primary hover:bg-primary/10 rounded"
                            title="공개 발행"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                        {post.status === "PUBLISHED" && post.visibility !== "PUBLIC" && (
                          <button
                            onClick={async () => {
                              const detail = await fetchBlog(post.id)
                              await updateBlog(post.id, {
                                title: detail.title,
                                content: detail.content,
                                visibility: "PUBLIC",
                              })
                              load()
                            }}
                            className="p-2 text-amber-600 hover:bg-amber-500/10 rounded text-xs px-2"
                            title="피드에 공개"
                          >
                            피드공개
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingBlogId(post.id)
                            setShowForm(true)
                          }}
                          className="p-2 text-primary hover:bg-primary/10 rounded"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm("삭제할까요?")) return
                            await deleteBlog(post.id)
                            load()
                          }}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
