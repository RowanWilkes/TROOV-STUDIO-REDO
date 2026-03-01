import { AVATARS } from "@/lib/avatars"

export function avatarSrcFromKey(key?: string | null): string | null {
  if (!key) return null
  const found = AVATARS.find((a) => a.key === key)
  return found ? found.src : null
}
