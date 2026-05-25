/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_DEV_CLOG_TOKEN: string
  readonly VITE_DEV_GITHUB_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
