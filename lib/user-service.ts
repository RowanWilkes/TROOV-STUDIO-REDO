export type SubscriptionPlan = "free" | "pro" | "professional"
export type SubscriptionStatus = "active" | "canceled" | "expired"

export interface User {
  email: string
  fullName: string
  lifetimeProjectCount: number
  subscriptionPlan: SubscriptionPlan
  subscriptionStatus: SubscriptionStatus
  createdAt: string
}

const USER_KEY = "design-studio-user"
const DEFAULT_FREE_PROJECT_LIMIT = 1

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const userData = localStorage.getItem(USER_KEY)
  if (!userData) return null
  return JSON.parse(userData)
}

export function updateUser(updates: Partial<User>): User | null {
  const user = getUser()
  if (!user) return null

  const updatedUser = { ...user, ...updates }
  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
  return updatedUser
}

export function incrementLifetimeProjectCount(): User | null {
  const user = getUser()
  if (!user) return null

  return updateUser({ lifetimeProjectCount: user.lifetimeProjectCount + 1 })
}

export function canCreateProject(): { allowed: boolean; reason?: string } {
  const user = getUser()
  if (!user) return { allowed: false, reason: "Not authenticated" }

  if (user.subscriptionPlan === "free") {
    if (user.lifetimeProjectCount >= DEFAULT_FREE_PROJECT_LIMIT) {
      return {
        allowed: false,
        reason: `You've used your free project. Upgrade to create unlimited projects!`,
      }
    }
  }

  // Pro and Professional: unlimited projects
  return { allowed: true }
}

export function canExportSummary(): { allowed: boolean; reason?: string } {
  const user = getUser()
  if (!user) return { allowed: false, reason: "Not authenticated" }

  if (user.subscriptionPlan === "free") {
    return {
      allowed: false,
      reason: "Upgrade to Pro to export summary reports as PDF.",
    }
  }

  return { allowed: true }
}

export function initializeUser(email: string, name: string): User {
  const user: User = {
    email,
    fullName: name,
    lifetimeProjectCount: 0,
    subscriptionPlan: "free",
    subscriptionStatus: "active",
    createdAt: new Date().toISOString(),
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}
