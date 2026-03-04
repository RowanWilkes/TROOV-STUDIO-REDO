"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { isSupabaseConnectionError } from "@/lib/supabaseConnection"
import { useSupabaseConnection } from "@/components/SupabaseConnectionProvider"

export type AppNotification = {
  id: string
  user_id: string
  project_id: string | null
  type: string
  title: string
  body: string | null
  url: string | null
  is_read: boolean
  created_at: string
}

const LIMIT = 20
const FAILURE_BACKOFF_MS = 30_000
const MAX_CONSECUTIVE_FAILURES = 3

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const consecutiveFailuresRef = useRef(0)
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const connection = useSupabaseConnection()

  const fetchNotifications = useCallback(
    async (userId: string, options?: { isRetryAfterBackoff?: boolean }) => {
      if (unavailable && !options?.isRetryAfterBackoff) return
      setLoading(true)
      setError(null)
      const { data, error: e } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(LIMIT)
      setLoading(false)
      if (e) {
        setError(e as Error)
        setNotifications([])
        if (connection?.setConnectionError && isSupabaseConnectionError(e)) {
          connection.setConnectionError(true)
        }
        consecutiveFailuresRef.current += 1
        if (consecutiveFailuresRef.current >= MAX_CONSECUTIVE_FAILURES) {
          setUnavailable(true)
          return
        }
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = setTimeout(() => {
          retryTimeoutRef.current = null
          fetchNotifications(userId, { isRetryAfterBackoff: true })
        }, FAILURE_BACKOFF_MS)
        return
      }
      consecutiveFailuresRef.current = 0
      setNotifications((data ?? []) as AppNotification[])
    },
    [unavailable, connection],
  )

  useEffect(() => {
    if (connection?.retryTrigger != null && connection.retryTrigger > 0) {
      setUnavailable(false)
      consecutiveFailuresRef.current = 0
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
    }
  }, [connection?.retryTrigger])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (cancelled || !session?.user?.id) {
        if (!session?.user?.id) setLoading(false)
        setNotifications([])
        return
      }
      if (unavailable) {
        setLoading(false)
        return
      }
      await fetchNotifications(session.user.id)
    }
    run()
    return () => {
      cancelled = true
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
    }
  }, [fetchNotifications, unavailable, connection?.retryTrigger])

  useEffect(() => {
    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (unavailable) return
      if (session?.user?.id) fetchNotifications(session.user.id)
      else setNotifications([])
    })
    return () => authSub?.unsubscribe()
  }, [fetchNotifications, unavailable])

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null
    let cancelled = false
    ;(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const userId = session?.user?.id
      if (cancelled || !userId) return
      channel = supabase
        .channel("notifications:" + userId)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          () => {
            if (!cancelled && !unavailable) fetchNotifications(userId)
          },
        )
      channel.subscribe()
    })()
    return () => {
      cancelled = true
      if (channel) supabase.removeChannel(channel)
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
    }
  }, [fetchNotifications, unavailable])

  const markRead = useCallback(async (id: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user?.id) return
    await supabase.from("notifications").update({ is_read: true }).eq("id", id).eq("user_id", session.user.id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
  }, [])

  const markAllRead = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user?.id) return
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", session.user.id).eq("is_read", false)
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }, [])

  const clearRead = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user?.id) return
    await supabase.from("notifications").delete().eq("user_id", session.user.id).eq("is_read", true)
    setNotifications((prev) => prev.filter((n) => !n.is_read))
  }, [])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return {
    notifications,
    unreadCount,
    loading,
    error,
    unavailable,
    markRead,
    markAllRead,
    clearRead,
  }
}
