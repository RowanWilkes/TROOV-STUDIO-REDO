"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

export type ProfileRow = {
  id: string
  full_name: string | null
  company: string | null
  role: string | null
  avatar_key: string | null
  created_at: string
  updated_at: string
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: Record<string, unknown> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [saving, setSaving] = useState(false)

  const refetch = useCallback(async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      setUser(null)
      setProfile(null)
      setLoading(false)
      setError(null)
      return
    }
    setUser(authUser)
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle()
    if (fetchError) {
      setLoading(false)
      setError(fetchError as Error)
      setProfile(null)
      return
    }
    if (!data) {
      const fallbackName =
        (authUser.user_metadata?.name as string) ??
        (authUser.user_metadata?.full_name as string) ??
        authUser.email?.split("@")[0] ??
        null
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({ id: authUser.id, full_name: fallbackName }, { onConflict: "id" })
      if (upsertError) {
        setLoading(false)
        setError(upsertError as Error)
        setProfile(null)
        return
      }
      const { data: refetched, error: refetchErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle()
      setProfile(refetched as ProfileRow | null)
    } else {
      setProfile(data as ProfileRow)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const displayName =
    profile?.full_name?.trim() ||
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    user?.email?.split("@")[0] ||
    ""

  const email = user?.email ?? ""

  const save = useCallback(
    async (updates: Partial<Pick<ProfileRow, "full_name" | "company" | "role" | "avatar_key">>) => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        setError(new Error("Not authenticated"))
        return
      }
      setSaving(true)
      setError(null)
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({ id: authUser.id, ...updates }, { onConflict: "id" })
      setSaving(false)
      if (upsertError) {
        setError(upsertError as Error)
        return
      }
      if (updates.full_name != null) {
        await supabase.auth.updateUser({
          data: { full_name: updates.full_name, name: updates.full_name },
        })
      }
      await refetch()
    },
    [refetch]
  )

  return { profile, displayName, email, loading, error, refetch, save, saving }
}
