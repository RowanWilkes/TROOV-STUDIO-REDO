import { getUser } from "./user-service"

/**
 * Gets a user-specific localStorage key
 * This ensures each user has their own separate data storage
 */
export function getUserStorageKey(baseKey: string): string {
  const user = getUser()
  if (!user) return baseKey // Fallback for unauthenticated state

  // Prefix the key with the user's email (sanitized)
  const sanitizedEmail = user.email.replace(/[^a-zA-Z0-9]/g, "_")
  return `${sanitizedEmail}_${baseKey}`
}

/**
 * Gets user-specific localStorage item
 */
export function getUserItem(baseKey: string): string | null {
  if (typeof window === "undefined") return null
  const key = getUserStorageKey(baseKey)
  return localStorage.getItem(key)
}

/**
 * Sets user-specific localStorage item
 */
export function setUserItem(baseKey: string, value: string): void {
  if (typeof window === "undefined") return
  const key = getUserStorageKey(baseKey)
  localStorage.setItem(key, value)
}

/**
 * Removes user-specific localStorage item
 */
export function removeUserItem(baseKey: string): void {
  if (typeof window === "undefined") return
  const key = getUserStorageKey(baseKey)
  localStorage.removeItem(key)
}
