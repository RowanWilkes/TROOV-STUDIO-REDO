"use client"

import { useEffect } from "react"
import { usePreferences } from "@/lib/usePreferences"

const COMPACT_DEFAULT = false
const SHOW_ANIMATIONS_DEFAULT = true

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { prefs } = usePreferences()

  const compactMode = prefs?.compact_mode ?? COMPACT_DEFAULT
  const showAnimations = prefs?.show_animations ?? SHOW_ANIMATIONS_DEFAULT

  useEffect(() => {
    const root = document.documentElement
    if (compactMode) root.classList.add("compact")
    else root.classList.remove("compact")
  }, [compactMode])

  useEffect(() => {
    const root = document.documentElement
    if (!showAnimations) root.classList.add("reduce-motion")
    else root.classList.remove("reduce-motion")
  }, [showAnimations])

  return <>{children}</>
}
