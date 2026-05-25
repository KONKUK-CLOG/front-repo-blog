import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import NavigationNext from "@/components/navigation-next"
import Footer from "@/components/footer"
import OAuthHandler from "@/components/oauth-handler"
import OAuthErrorBanner from "@/components/oauth-error-banner"
import { AuthProvider } from "@/lib/auth-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CLOG | 개발 블로그",
  description: "Extension과 연동된 CLOG 개발 블로그 — 글 읽기, 댓글, 북마크",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <OAuthHandler />
          <OAuthErrorBanner />
          <NavigationNext />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
