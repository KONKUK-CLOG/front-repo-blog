import { Link } from "react-router-dom"
import { Eye, Calendar } from "lucide-react"
import type { BlogSummary } from "@/lib/api/types"
import { formatDate } from "@/lib/format"
import BookmarkButton from "@/components/bookmark-button"

interface BlogPostCardProps {
  post: BlogSummary
  excerpt?: string
  authorName?: string
  showBookmark?: boolean
}

export default function BlogPostCard({ post, excerpt, authorName, showBookmark }: BlogPostCardProps) {
  return (
    <div className="post-card group flex items-start gap-3">
      <Link to={`/blog/${post.id}`} className="block flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                {post.status === "PUBLISHED" ? "발행" : post.status}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.publishedAt ?? post.createdAt)}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.viewCount}
              </span>
            </div>
            <h3 className="prose-heading text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            {excerpt && <p className="prose-paragraph text-sm line-clamp-2">{excerpt}</p>}
            {authorName && (
              <p className="text-xs text-muted-foreground mt-2">by {authorName}</p>
            )}
          </div>
        </div>
      </Link>
      {showBookmark && (
        <div className="shrink-0 pt-1" onClick={(e) => e.stopPropagation()}>
          <BookmarkButton blogId={post.id} compact />
        </div>
      )}
    </div>
  )
}
