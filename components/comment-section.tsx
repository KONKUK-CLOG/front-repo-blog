
import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { createComment, deleteComment, fetchComments } from "@/lib/api/comments"
import type { Comment } from "@/lib/api/types"
import { formatDateTime } from "@/lib/format"
import { Trash2, Loader2 } from "lucide-react"

interface CommentSectionProps {
  blogId: number
}

export default function CommentSection({ blogId }: CommentSectionProps) {
  const { user, getAvatar, login } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState("")
  const [guestNickname, setGuestNickname] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const list = await fetchComments(blogId)
      setComments(list)
    } finally {
      setLoading(false)
    }
  }, [blogId])

  useEffect(() => {
    load()
  }, [load])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    if (!user && !guestNickname.trim()) return

    setSubmitting(true)
    try {
      await createComment({
        blogId,
        content: content.trim(),
        authorType: user ? "MEMBER" : "GUEST",
        guestNickname: user ? undefined : guestNickname.trim(),
      })
      setContent("")
      await load()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: number) => {
    if (!confirm("댓글을 삭제할까요?")) return
    await deleteComment(commentId)
    await load()
  }

  const displayName = (c: Comment) =>
    c.authorType === "GUEST" ? c.guestNickname ?? "익명" : c.author?.nickname ?? "회원"

  const displayAvatar = (c: Comment) => {
    if (c.author) return getAvatar(c.author)
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName(c))}&background=e5e7eb&color=374151`
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="post-card p-6 space-y-4">
        <label className="block text-sm font-medium">댓글 작성</label>
        {!user && (
          <input
            type="text"
            value={guestNickname}
            onChange={(e) => setGuestNickname(e.target.value)}
            placeholder="닉네임 (게스트)"
            maxLength={30}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={user ? "댓글을 입력해주세요..." : "로그인 없이도 댓글을 남길 수 있습니다."}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
        />
        <div className="flex items-center justify-between gap-4">
          {!user && (
            <button
              type="button"
              onClick={login}
              className="text-sm text-primary hover:underline"
            >
              GitHub 로그인
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || !content.trim() || (!user && !guestNickname.trim())}
            className="ml-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {submitting ? "등록 중…" : "댓글 작성"}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <div className="post-card p-6 text-center text-muted-foreground">
          아직 댓글이 없습니다. 첫 번째 댓글을 작성해주세요!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="post-card p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={displayAvatar(comment)}
                    alt=""
                    className="h-8 w-8 rounded-full border border-border"
                  />
                  <div>
                    <p className="font-medium text-foreground">{displayName(comment)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(comment.createdAt)}
                      {comment.authorType === "GUEST" && " · 게스트"}
                    </p>
                  </div>
                </div>
                {user && comment.author?.id === user.id && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="text-foreground/80 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
