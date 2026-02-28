"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

const DEBOUNCE_MS = 500

export type UseProjectRowOptions<T> = {
  tableName: string
  projectId: string | null
  defaults: Record<string, unknown>
  fromRow: (row: Record<string, unknown> | null) => T
  toPayload: (data: T) => Record<string, unknown>
}

export function useProjectRow<T>(options: UseProjectRowOptions<T>) {
  const { tableName, projectId, defaults, fromRow, toPayload } = options
  const router = useRouter()
  const fromRowRef = useRef(fromRow)
  const defaultsRef = useRef(defaults)
  const toPayloadRef = useRef(toPayload)
  fromRowRef.current = fromRow
  defaultsRef.current = defaults
  toPayloadRef.current = toPayload
  const [data, setDataState] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestPayloadRef = useRef<Record<string, unknown> | null>(null)

  const setData = useCallback((value: T | ((prev: T | null) => T | null)) => {
    setDataState((prev) => {
      const next = typeof value === "function" ? (value as (p: T | null) => T | null)(prev) : value
      return next
    })
  }, [])

  useEffect(() => {
    if (!projectId) {
      setIsLoading(false)
      setDataState(null)
      setError(null)
      return
    }
    let cancelled = false
    setIsLoading(true)
    setError(null)

    ;(async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()
      if (sessionError || !session) {
        if (!cancelled) router.replace("/login")
        return
      }

      const { data: row, error: loadError } = await supabase
        .from(tableName)
        .select("*")
        .eq("project_id", projectId)
        .maybeSingle()

      if (cancelled) return
      if (loadError) {
        console.log(`[useProjectRow] load ${tableName} projectId=${projectId} error`, loadError)
        setError(loadError as unknown as Error)
        setIsLoading(false)
        return
      }
      const fromRowFn = fromRowRef.current
      const defaultsVal = defaultsRef.current
      if (row) {
        console.log(`[useProjectRow] load ${tableName} projectId=${projectId} success`)
        setDataState(fromRowFn(row as Record<string, unknown>))
      } else {
        console.log(`[useProjectRow] load ${tableName} projectId=${projectId} none`)
        const { error: insertErr } = await supabase.from(tableName).insert({
          project_id: projectId,
          user_id: session.user.id,
          ...defaultsVal,
        })
        if (insertErr && !cancelled) {
          console.log(`[useProjectRow] insert ${tableName} error`, insertErr)
          setError(insertErr as unknown as Error)
        }
        setDataState(fromRowFn(null))
      }
      if (!cancelled) setIsLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [tableName, projectId])

  useEffect(() => {
    if (!projectId || data === null) return
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

    saveTimeoutRef.current = setTimeout(async () => {
      saveTimeoutRef.current = null
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()
      if (sessionError || !session) return

      const payload = {
        ...toPayloadRef.current(data),
        project_id: projectId,
        user_id: session.user.id,
      }
      latestPayloadRef.current = payload
      console.log(`[useProjectRow] upsert ${tableName} payload keys`, Object.keys(payload))
      setIsSaving(true)

      const { error: upsertError } = await supabase
        .from(tableName)
        .upsert(payload, { onConflict: "project_id" })

      if (upsertError) {
        console.log(`[useProjectRow] upsert ${tableName} error`, upsertError)
      } else {
        console.log(`[useProjectRow] upsert ${tableName} success`)
      }
      setIsSaving(false)
    }, DEBOUNCE_MS)

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [tableName, projectId, data])

  return { data, setData, isLoading, isSaving, error, latestPayloadRef }
}
