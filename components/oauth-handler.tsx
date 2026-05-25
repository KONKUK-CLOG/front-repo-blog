"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  handleOAuthCallback,
  stashOAuthError,
} from "@/lib/oauth-callback-handler"

/** GitHub OAuth redirect_uri가 사이트 루트(/?code=)일 때 code 처리 */
export default function OAuthHandler({ onDone }: { onDone?: () => void }) {
  const { completeOAuth } = useAuth()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    let cancelled = false

    handleOAuthCallback(completeOAuth).then((result) => {
      if (cancelled || result.status === "none") return
      if (result.status === "error") {
        stashOAuthError(result.message)
      }
      onDone?.()
    })

    return () => {
      cancelled = true
    }
  }, [completeOAuth, onDone])

  return null
}
