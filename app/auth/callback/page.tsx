import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import AuthCallbackClient from "./auth-callback-client"

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center gap-4 py-32">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">로딩 중…</p>
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  )
}
