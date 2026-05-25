import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/lib/auth-context"
import OAuthQueryHandler from "./OAuthQueryHandler"
import Layout from "./Layout"
import HomePage from "./pages/HomePage"
import BlogPage from "./pages/BlogPage"
import BlogDetailPage from "./pages/BlogDetailPage"
import AboutPage from "./pages/AboutPage"
import AdminPage from "./pages/AdminPage"
import BookmarksPage from "./pages/BookmarksPage"
import AuthCallbackPage from "./pages/AuthCallbackPage"
import GithubLoginRedirect from "@/components/github-login-redirect"

export default function App() {
  return (
    <AuthProvider>
      <OAuthQueryHandler />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:blogId" element={<BlogDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="auth/login" element={<GithubLoginRedirect />} />
          <Route path="auth/callback" element={<AuthCallbackPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
