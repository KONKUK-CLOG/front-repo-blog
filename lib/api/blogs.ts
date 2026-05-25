import { apiRequest } from "@/lib/api/client"
import type {
  BlogCreatePayload,
  BlogDetail,
  BlogSummary,
  BlogUpdatePayload,
} from "@/lib/api/types"

export function fetchPublishedBlogs() {
  return apiRequest<BlogSummary[]>("/api/blogs/published")
}

export function fetchBlog(blogId: number) {
  return apiRequest<BlogDetail>(`/api/blogs/${blogId}`, { withToken: true })
}

export function fetchUserBlogs(userId: number) {
  return apiRequest<BlogSummary[]>(`/api/blogs/users/${userId}`, { withToken: true })
}

export function createBlog(payload: BlogCreatePayload) {
  return apiRequest<BlogDetail>("/api/blogs", { method: "POST", body: payload, auth: true })
}

export function updateBlog(blogId: number, payload: BlogUpdatePayload) {
  return apiRequest<BlogDetail>(`/api/blogs/${blogId}`, {
    method: "PUT",
    body: payload,
    auth: true,
  })
}

export function publishBlog(blogId: number) {
  return apiRequest<void>(`/api/blogs/${blogId}/publish`, { method: "POST", auth: true })
}

export function deleteBlog(blogId: number) {
  return apiRequest<void>(`/api/blogs/${blogId}`, { method: "DELETE", auth: true })
}

export function incrementView(blogId: number) {
  return apiRequest<void>(`/api/blogs/${blogId}/view`, { method: "POST" })
}
