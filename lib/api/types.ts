export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
}

export type BlogStatus = "DRAFT" | "PUBLISHED" | "DELETED"
export type BlogVisibility = "PUBLIC" | "PRIVATE" | "LINKED"
export type AuthorType = "MEMBER" | "GUEST"

export interface UserResponse {
  id: number
  name: string
  nickname: string
  email: string
  socialId: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
}

export interface BlogSummary {
  id: number
  title: string
  status: BlogStatus
  visibility: BlogVisibility
  viewCount: number
  publishedAt: string | null
  createdAt: string
}

export interface BlogDetail {
  id: number
  author: UserResponse
  title: string
  content: string
  status: BlogStatus
  visibility: BlogVisibility
  viewCount: number
  ogTitle: string | null
  ogBlogUrl: string | null
  publishedAt: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  comments: Comment[]
}

export interface Comment {
  id: number
  blogId: number
  author: UserResponse | null
  guestNickname: string | null
  authorType: AuthorType
  content: string
  createdAt: string
  updatedAt: string
}

export interface Bookmark {
  id: number
  blog: BlogSummary
  createdAt: string
}

export interface BlogCreatePayload {
  title: string
  content: string
  status?: BlogStatus
  visibility?: BlogVisibility
  ogTitle?: string
  ogBlogUrl?: string
}

export interface BlogUpdatePayload extends BlogCreatePayload {}

export interface CommentCreatePayload {
  blogId: number
  content: string
  authorType: AuthorType
  guestNickname?: string
}

export interface JwtClaims {
  sub: string
  nickname?: string
  email?: string
  exp?: number
}
