/** Vite(VITE_*) · Next(NEXT_PUBLIC_*) 공통 env 읽기 */
export function readPublicEnv(name: string): string | undefined {
  const viteKey = `VITE_${name}` as keyof ImportMetaEnv
  const viteVal = import.meta.env?.[viteKey]
  if (typeof viteVal === "string" && viteVal.trim()) {
    return viteVal.trim()
  }

  const nextKey = `NEXT_PUBLIC_${name}`
  const nextVal =
    typeof process !== "undefined" ? process.env[nextKey] : undefined
  if (typeof nextVal === "string" && nextVal.trim()) {
    return nextVal.trim()
  }

  return undefined
}
