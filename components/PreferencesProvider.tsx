"use client"

import { useEffect } from "react"
import { usePreferences } from "@/lib/usePreferences"

const THEME_DEFAULT = "light"
const COMPACT_DEFAULT = false
const SHOW_ANIMATIONS_DEFAULT = true

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { prefs } = usePreferences()

  const theme = prefs?.theme ?? THEME_DEFAULT
  const compactMode = prefs?.compact_mode ?? COMPACT_DEFAULT
  const showAnimations = prefs?.show_animations ?? SHOW_ANIMATIONS_DEFAULT

  useEffect(() => {
    const root = document.documentElement

    if (theme === "dark") {
      root.classList.add("dark")
    } else if (theme === "light") {
      root.classList.remove("dark")
    } else {
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      const apply = () => {
        if (media.matches) root.classList.add("dark")
        else root.classList.remove("dark")
      }
      apply()
      media.addEventListener("change", apply)
      return () => media.removeEventListener("change", apply)
    }
  }, [theme])

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
