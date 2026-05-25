"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Clock, User, Calendar, Share2, MessageCircle, Eye, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchBlog, incrementView } from "@/lib/api/blogs"
import type { BlogDetail } from "@/lib/api/types"
import { ApiError } from "@/lib/api/client"
import { formatDate, estimateReadTime } from "@/lib/format"
import ShareMenu from "@/components/share-menu"
import CommentSection from "@/components/comment-section"
import BookmarkButton from "@/components/bookmark-button"

export default function PostPage() {
  const params = useParams()
  const blogId = Number(params.blogId)
  const [post, setPost] = useState<BlogDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [viewRecorded, setViewRecorded] = useState(false)

  useEffect(() => {
    if (!Number.isFinite(blogId)) {
      setError("잘못된 글 주소입니다.")
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchBlog(blogId)
      .then((data) => {
        if (!cancelled) setPost(data)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof ApiError ? e.message : "글을 불러오지 못했습니다.")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [blogId])

  useEffect(() => {
    if (!post || viewRecorded || post.status !== "PUBLISHED") return
    incrementView(blogId)
      .then(() => setViewRecorded(true))
      .catch(() => {})
  }, [post, blogId, viewRecorded])

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="prose-heading text-4xl mb-4">글을 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link href="/blog" className="text-primary hover:underline">
          블로그로 돌아가기
        </Link>
      </div>
    )
  }

  const readTime = estimateReadTime(post.content)
  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/blog/${post.id}` : ""

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
        <ArrowLeft className="h-4 w-4" />
        블로그로 돌아가기
      </Link>

      <article className="mb-12">
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            {post.status}
          </span>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-muted-foreground">
            {post.visibility}
          </span>
        </div>
        <h1 className="prose-heading text-4xl md:text-5xl mb-6 leading-tight">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {post.author.nickname}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(post.publishedAt ?? post.createdAt)}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {readTime}
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {post.viewCount}
          </div>
        </div>
      </article>

      <div className="border-t border-border my-8" />

      <div className="prose prose-lg max-w-none mb-12">
        <div
          className="prose-content space-y-6 text-foreground/80 leading-relaxed blog-html"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            공유하기
          </button>
          {showShareMenu && (
            <ShareMenu
              slug={String(post.id)}
              url={shareUrl}
              title={post.title}
              onShare={() => setShowShareMenu(false)}
            />
          )}
        </div>
        <BookmarkButton blogId={post.id} />
      </div>

      <div className="border-t border-border my-12 pt-12">
        <h2 className="prose-heading text-2xl mb-6 flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          댓글
        </h2>
        <CommentSection blogId={post.id} />
      </div>
    </div>
  )
}
