import { apiRequest } from "@/lib/api/client"
import type { Comment, CommentCreatePayload } from "@/lib/api/types"

export function fetchComments(blogId: number) {
  return apiRequest<Comment[]>(`/api/comments/blog/${blogId}`)
}

export function createComment(payload: CommentCreatePayload) {
  const needsAuth = payload.authorType === "MEMBER"
  return apiRequest<Comment>("/api/comments", {
    method: "POST",
    body: payload,
    auth: needsAuth,
  })
}

export function updateComment(commentId: number, content: string) {
  return apiRequest<Comment>(`/api/comments/${commentId}`, {
    method: "PUT",
    body: { content },
    auth: true,
  })
}

export function deleteComment(commentId: number) {
  return apiRequest<void>(`/api/comments/${commentId}`, { method: "DELETE", auth: true })
}
