"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  handleOAuthCallback,
  stashOAuthError,
} from "@/lib/oauth-callback-handler"

export default function AuthCallbackClient() {
  const router = useRouter()
  const { completeOAuth } = useAuth()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    handleOAuthCallback(completeOAuth).then((result) => {
      if (result.status === "none") {
        stashOAuthError("인증 코드가 없습니다.")
        router.replace("/")
        return
      }
      if (result.status === "error") {
        stashOAuthError(result.message)
      }
      router.replace("/")
    })
  }, [completeOAuth, router])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground">GitHub 로그인 처리 중…</p>
    </div>
  )
}
