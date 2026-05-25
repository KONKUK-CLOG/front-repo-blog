"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut, LogIn, Loader2 } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export default function NavigationNext() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, login, logout, isLoading, getAvatar } = useAuth()

  const navItems = [
    { label: "홈", href: "/" },
    { label: "블로그", href: "/blog" },
    { label: "소개", href: "/about" },
    ...(user
      ? [
          { label: "관리", href: "/admin" },
          { label: "북마크", href: "/bookmarks" },
        ]
      : []),
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              C
            </span>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              CLOG
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  isActive(item.href) ? "text-primary" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
            <div className="flex items-center gap-3 border-l border-border/40 pl-6">
              {user ? (
                <>
                  <img
                    src={getAvatar()}
                    alt=""
                    className="h-8 w-8 rounded-full border border-border"
                  />
                  <span className="text-sm font-medium text-foreground/80 max-w-[120px] truncate">
                    {user.nickname}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-destructive/10 text-destructive hover:bg-destructive/20"
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={login}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  GitHub 로그인
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="메뉴"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 space-y-1 border-t border-border/40 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-destructive"
              >
                로그아웃
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  login()
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg"
              >
                GitHub 로그인
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
