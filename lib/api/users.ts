import { apiRequest } from "@/lib/api/client"
import type { UserResponse } from "@/lib/api/types"

export function fetchCurrentUser(userId: number) {
  return apiRequest<UserResponse>(`/api/users/${userId}`, { auth: true })
}
