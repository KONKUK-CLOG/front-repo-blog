"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { createBlog, fetchBlog, publishBlog, updateBlog } from "@/lib/api/blogs"
import type { BlogDetail, BlogVisibility } from "@/lib/api/types"
import { ApiError } from "@/lib/api/client"

interface PostFormProps {
  editingBlogId?: number | null
  onClose: () => void
  onSaved: () => void
}

export default function PostForm({ editingBlogId, onClose, onSaved }: PostFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    visibility: "PUBLIC" as BlogVisibility,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!editingBlogId) return
    fetchBlog(editingBlogId).then((post: BlogDetail) => {
      setFormData({
        title: post.title,
        content: post.content,
        visibility: post.visibility,
      })
    })
  }, [editingBlogId])

  const handleSubmit = async (e: React.FormEvent, andPublish = false) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      let blogId = editingBlogId
      if (editingBlogId) {
        await updateBlog(editingBlogId, formData)
      } else {
        const created = await createBlog({
          ...formData,
          status: "DRAFT",
        })
        blogId = created.id
      }
      if (andPublish && blogId) {
        if (formData.visibility !== "PUBLIC") {
          await updateBlog(blogId, { ...formData, visibility: "PUBLIC" })
        }
        await publishBlog(blogId)
      }
      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="post-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="prose-heading text-2xl">{editingBlogId ? "글 수정" : "새 글 작성"}</h2>
        <button type="button" onClick={onClose} className="p-2 text-foreground/70 hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
      )}

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">제목</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
            required
            maxLength={150}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">내용 (HTML 가능)</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background font-mono text-sm focus:ring-2 focus:ring-primary outline-none"
            rows={12}
            placeholder="<h2>제목</h2><p>본문</p>"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">공개 범위</label>
          <select
            value={formData.visibility}
            onChange={(e) =>
              setFormData({ ...formData, visibility: e.target.value as BlogVisibility })
            }
            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="PUBLIC">공개 — 홈·블로그 피드에 표시</option>
            <option value="PRIVATE">비공개 — 관리자·본인만 (피드 제외)</option>
            <option value="LINKED">링크 공유 — URL로만 (피드 제외)</option>
          </select>
          <p className="text-xs text-muted-foreground mt-2">
            피드에 보이려면 <strong>공개</strong> + <strong>발행</strong> 상태여야 합니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, false)}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "저장 중…" : editingBlogId ? "수정 저장" : "초안 저장"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, true)}
            className="px-6 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 disabled:opacity-50"
          >
            저장 후 발행
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-border rounded-lg font-medium hover:bg-secondary"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
