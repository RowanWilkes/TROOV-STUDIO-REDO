"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

export type UserPreferencesRow = {
  user_id: string
  theme: "light" | "dark" | "system"
  compact_mode: boolean
  show_animations: boolean
  email_notifications: boolean
  task_reminders: boolean
  weekly_summary: boolean
  auto_save: boolean
  collapse_sidebar: boolean
  default_project_view: string
  updated_at: string
}

const DEFAULTS: Omit<UserPreferencesRow, "user_id" | "updated_at"> = {
  theme: "system",
  compact_mode: false,
  show_animations: true,
  email_notifications: true,
  task_reminders: true,
  weekly_summary: false,
  auto_save: true,
  collapse_sidebar: false,
  default_project_view: "home",
}

export function usePreferences() {
  const [prefs, setPrefs] = useState<UserPreferencesRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [saving, setSaving] = useState(false)

  const refetch = useCallback(async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    if (!authUser) {
      setPrefs(null)
      setLoading(false)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", authUser.id)
      .maybeSingle()

    if (fetchError) {
      setLoading(false)
      setError(fetchError as Error)
      setPrefs(null)
      return
    }

    if (!data) {
      const { error: upsertError } = await supabase.from("user_preferences").upsert(
        { user_id: authUser.id, ...DEFAULTS },
        { onConflict: "user_id" },
      )
      if (upsertError) {
        setLoading(false)
        setError(upsertError as Error)
        setPrefs(null)
        return
      }
      const { data: refetched, error: refetchErr } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", authUser.id)
        .maybeSingle()
      setPrefs(refetched as UserPreferencesRow | null)
      setError(refetchErr ? (refetchErr as Error) : null)
    } else {
      setPrefs(data as UserPreferencesRow)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const updatePrefs = useCallback(
    async (partial: Partial<Omit<UserPreferencesRow, "user_id" | "updated_at">>) => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (!authUser) {
        setError(new Error("Not authenticated"))
        return
      }
      setSaving(true)
      setError(null)
      const { error: upsertError } = await supabase
        .from("user_preferences")
        .upsert({ user_id: authUser.id, ...partial }, { onConflict: "user_id" })
      setSaving(false)
      if (upsertError) {
        setError(upsertError as Error)
        return
      }
      setPrefs((prev) =>
        prev ? { ...prev, ...partial, updated_at: prev.updated_at } : null,
      )
    },
    [],
  )

  return { prefs, loading, error, updatePrefs, saving }
}
