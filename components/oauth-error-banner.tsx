"use client"

import { useEffect, useState } from "react"
import { takeOAuthError } from "@/lib/oauth-callback-handler"

export default function OAuthErrorBanner() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    setMessage(takeOAuthError())
  }, [])

  if (!message) return null

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
      <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
        {message}
      </p>
    </div>
  )
}
