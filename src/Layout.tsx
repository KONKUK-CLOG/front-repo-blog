import { Outlet } from "react-router-dom"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import OAuthErrorBanner from "@/components/oauth-error-banner"

export default function Layout() {
  return (
    <>
      <Navigation />
      <OAuthErrorBanner />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
