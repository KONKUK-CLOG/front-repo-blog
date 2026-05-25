import type { NextConfig } from "next"

const apiTarget = process.env.API_PROXY_TARGET ?? "https://clog.r-e.kr"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiTarget}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
