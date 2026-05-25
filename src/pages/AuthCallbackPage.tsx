import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  handleOAuthCallback,
  stashOAuthError,
} from "@/lib/oauth-callback-handler"

/** redirect_uri를 /#/auth/callback 으로 둔 경우의 보조 처리 */
export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const { completeOAuth } = useAuth()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    handleOAuthCallback(completeOAuth).then((result) => {
      if (result.status === "none") {
        stashOAuthError("인증 코드가 없습니다.")
        navigate("/", { replace: true })
        return
      }
      if (result.status === "error") {
        stashOAuthError(result.message)
      }
      navigate("/", { replace: true })
    })
  }, [completeOAuth, navigate])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground">GitHub 로그인 처리 중…</p>
    </div>
  )
}
