import { Twitter, Facebook, Linkedin, Link2 } from "lucide-react"
import { appUrl } from "@/lib/app-path"

interface ShareMenuProps {
  slug: string
  url?: string
  title?: string
  onShare: (platform: string) => void
}

export default function ShareMenu({ slug, url, title, onShare }: ShareMenuProps) {
  const shareUrl = url ?? appUrl(`/blog/${slug}`)
  const text = title ? `"${title}"` : "CLOG 블로그"

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    }

    if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl)
    } else if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400")
    }
    onShare(platform)
  }

  return (
    <div className="absolute left-0 top-full mt-2 z-10 post-card p-2 min-w-[180px] shadow-lg">
      <button
        onClick={() => handleShare("twitter")}
        className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
      >
        <Twitter className="h-4 w-4" />
        Twitter
      </button>
      <button
        onClick={() => handleShare("facebook")}
        className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
      >
        <Facebook className="h-4 w-4" />
        Facebook
      </button>
      <button
        onClick={() => handleShare("linkedin")}
        className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
      >
        <Linkedin className="h-4 w-4" />
        LinkedIn
      </button>
      <button
        onClick={() => handleShare("copy")}
        className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
      >
        <Link2 className="h-4 w-4" />
        링크 복사
      </button>
    </div>
  )
}
