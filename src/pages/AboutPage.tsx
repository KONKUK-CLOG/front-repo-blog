
import { Link } from "react-router-dom"
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="mb-16">
        <p className="text-sm font-medium text-primary mb-2">CLOG</p>
        <h1 className="prose-heading text-5xl md:text-6xl mb-4">소개</h1>
        <p className="text-lg text-foreground/70 md:text-xl leading-relaxed">
          CLOG는 코딩 세션에서 생성·발행한 글을 모아 보는 웹 블로그입니다. GitHub 로그인으로 글을 관리할 수 있습니다.
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* About */}
          <section>
            <h2 className="prose-heading text-3xl mb-4">나에 대해</h2>
            <div className="space-y-4 prose-paragraph">
              <p>
                저는 React, TypeScript, Next.js를 중심으로 개발하고 있습니다. 최신 웹 기술을 배우고 실무에 적용하는 것을
                즐깁니다.
              </p>
              <p>
                Extension에서 작성한 초안을 발행하면 이 웹에서 공개 피드로 노출됩니다. 댓글은 회원·게스트 모두 가능하며,
                북마크로 나중에 읽을 글을 저장할 수 있습니다.
              </p>
            </div>
          </section>

          {/* Experience */}
          <section>
            <h2 className="prose-heading text-3xl mb-6">경력</h2>
            <div className="space-y-6">
              <div className="post-card">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="prose-heading text-lg">Senior Frontend Developer</h3>
                    <p className="text-sm text-muted-foreground">Tech Company Inc.</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">2022 - Now</span>
                </div>
                <p className="prose-paragraph text-sm">
                  React, TypeScript, Next.js를 활용한 대규모 프로젝트 개발 및 팀 리드
                </p>
              </div>
              <div className="post-card">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="prose-heading text-lg">Frontend Developer</h3>
                    <p className="text-sm text-muted-foreground">Startup Corp.</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">2020 - 2022</span>
                </div>
                <p className="prose-paragraph text-sm">초기 스타트업 단계에서 전체 프론트엔드 아키텍처 설계 및 개발</p>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="prose-heading text-3xl mb-6">기술 스택</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="post-card">
                <h3 className="prose-heading text-lg mb-3">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "TypeScript", "Tailwind CSS", "Spring Boot", "GitHub OAuth"].map((skill) => (
                    <span key={skill} className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="post-card">
                <h3 className="prose-heading text-lg mb-3">Backend & DevOps</h3>
                <div className="flex flex-wrap gap-2">
                  {["Java", "MySQL", "MongoDB", "JWT", "REST API"].map((skill) => (
                    <span key={skill} className="text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section>
            <h2 className="prose-heading text-3xl mb-6">프로젝트</h2>
            <div className="space-y-4">
              {[
                {
                  name: "E-Commerce Platform",
                  description: "최신 기술스택을 활용한 풀스택 이커머스 플랫폼",
                  tech: ["React", "Next.js", "Stripe", "PostgreSQL"],
                },
                {
                  name: "Analytics Dashboard",
                  description: "실시간 데이터 시각화 대시보드",
                  tech: ["React", "TypeScript", "Chart.js", "Socket.io"],
                },
                {
                  name: "Collaboration Tool",
                  description: "팀 협업을 위한 웹 기반 도구",
                  tech: ["Next.js", "WebSocket", "Redis", "MongoDB"],
                },
              ].map((project) => (
                <div key={project.name} className="post-card">
                  <h3 className="prose-heading text-lg mb-2">{project.name}</h3>
                  <p className="prose-paragraph text-sm mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Contact */}
          <div className="post-card">
            <h3 className="prose-heading text-lg mb-4">연락처</h3>
            <div className="space-y-3">
              <a
                href="mailto:hello@devblog.com"
                className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm">hello@devblog.com</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="text-sm">GitHub</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="text-sm">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="post-card">
            <h3 className="prose-heading text-lg mb-4">바로가기</h3>
            <div className="space-y-2">
              <Link
                to="/blog"
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                모든 글 보기
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                홈으로 돌아가기
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="post-card">
            <h3 className="prose-heading text-lg mb-3">뉴스레터</h3>
            <p className="prose-paragraph text-xs mb-4">새로운 글을 이메일로 받아보세요.</p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="이메일 주소"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="w-full rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
                구독
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
