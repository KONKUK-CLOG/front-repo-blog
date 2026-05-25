import { Link } from "react-router-dom"
import { Github, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3 mb-8">
          {/* About Section */}
          <div>
            <h3 className="prose-heading text-lg mb-3">CLOG</h3>
            <p className="text-sm text-foreground/70 mb-4">
              VS Code Extension과 연동된 개발 블로그. 발행된 글을 읽고 댓글·북마크로 기록을 이어가세요.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="prose-heading text-lg mb-3">바로가기</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  홈
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  모든 글
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  소개
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="prose-heading text-lg mb-3">연락처</h3>
            <div className="flex gap-4">
              <a
                href="mailto:hello@devblog.com"
                className="text-foreground/70 hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 pt-8">
          <p className="text-center text-sm text-muted-foreground">© {currentYear} CLOG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
