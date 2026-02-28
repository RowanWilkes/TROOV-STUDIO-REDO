"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export type UseProjectListOptions<T> = {
  tableName: string
  projectId: string | null
  fromRow: (row: Record<string, unknown>) => T
  toRow: (item: T) => Record<string, unknown>
}

export function useProjectList<T extends { id?: string }>(options: UseProjectListOptions<T>) {
  const { tableName, projectId, fromRow, toRow } = options
  const router = useRouter()
  const fromRowRef = useRef(fromRow)
  fromRowRef.current = fromRow
  const [items, setItems] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    if (!projectId) return
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()
    if (sessionError || !session) return
    const { data: rows, error: loadError } = await supabase
      .from(tableName)
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true })
    if (loadError) {
      console.log(`[useProjectList] load ${tableName} projectId=${projectId} error`, loadError)
      setError(loadError as unknown as Error)
      setItems([])
    } else {
      const list = (rows ?? []).map((r) => fromRowRef.current(r as Record<string, unknown>))
      console.log(`[useProjectList] load ${tableName} projectId=${projectId} count=${list.length}`)
      setItems(list)
      setError(null)
    }
  }, [tableName, projectId])

  useEffect(() => {
    if (!projectId) {
      setItems([])
      setIsLoading(false)
      return
    }
    let cancelled = false
    setIsLoading(true)
    ;(async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()
      if (sessionError || !session) {
        if (!cancelled) router.replace("/login")
        return
      }
      const { data: rows, error: loadError } = await supabase
        .from(tableName)
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true })
      if (cancelled) return
      if (loadError) {
        console.log(`[useProjectList] load ${tableName} projectId=${projectId} error`, loadError)
        setError(loadError as unknown as Error)
        setItems([])
      } else {
        const list = (rows ?? []).map((r) => fromRowRef.current(r as Record<string, unknown>))
        console.log(`[useProjectList] load ${tableName} projectId=${projectId} count=${list.length}`)
        setItems(list)
        setError(null)
      }
      if (!cancelled) setIsLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [tableName, projectId, router])

  const createItem = useCallback(
    async (item: T) => {
      if (!projectId) return
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()
      if (sessionError || !session) {
        router.replace("/login")
        return
      }
      const row = toRow(item)
      const { data: inserted, error: insertErr } = await supabase
        .from(tableName)
        .insert({ ...row, project_id: projectId, user_id: session.user.id })
        .select()
        .single()
      if (insertErr) {
        console.log(`[useProjectList] create ${tableName} error`, insertErr)
        return
      }
      console.log(`[useProjectList] create ${tableName} success`)
      setItems((prev) => [...prev, fromRowRef.current((inserted ?? row) as Record<string, unknown>)])
    },
    [tableName, projectId, toRow, router]
  )

  const updateItem = useCallback(
    async (id: string, patch: Partial<T>) => {
      if (!projectId) return
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()
      if (sessionError || !session) {
        router.replace("/login")
        return
      }
      const toPatch = patch as Record<string, unknown>
      const { error: updateErr } = await supabase
        .from(tableName)
        .update(toPatch)
        .eq("id", id)
        .eq("project_id", projectId)
        .eq("user_id", session.user.id)
      if (updateErr) {
        console.log(`[useProjectList] update ${tableName} error`, updateErr)
        return
      }
      console.log(`[useProjectList] update ${tableName} success`)
      setItems((prev) =>
        prev.map((i) => (String((i as { id?: string }).id) === id ? { ...i, ...patch } : i))
      )
    },
    [tableName, projectId, router]
  )

  const deleteItem = useCallback(
    async (id: string) => {
      if (!projectId) return
      const { error: deleteErr } = await supabase
        .from(tableName)
        .delete()
        .eq("id", id)
        .eq("project_id", projectId)
      if (deleteErr) {
        console.log(`[useProjectList] delete ${tableName} error`, deleteErr)
        return
      }
      console.log(`[useProjectList] delete ${tableName} success`)
      setItems((prev) => prev.filter((i) => String((i as { id?: string }).id) !== id))
    },
    [tableName, projectId]
  )

  return { items, createItem, updateItem, deleteItem, isLoading, error, refetch }
}
