"use client"

import { useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

/** /auth/login 접근 시 토큰 입력 없이 GitHub OAuth로 바로 이동 */
export default function GithubLoginRedirect() {
  const { login } = useAuth()
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    login()
  }, [login])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground">GitHub 로그인 페이지로 이동 중…</p>
    </div>
  )
}
