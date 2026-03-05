/**
 * Background prefetch for all project section data.
 * Populates the query-cache so every section view and the summary page
 * are instant on first navigation after login.
 */

import { supabase } from "@/lib/supabase"
import { queryCache } from "@/lib/query-cache"

const SINGLE_ROW_TABLES = [
  "project_overview",
  "mood_board",
  "style_guide",
  "sitemap",
  "technical_specs",
  "content_section",
  "asset_section",
] as const

export async function prefetchProjectSections(projectId: string): Promise<void> {
  const tasks: Promise<void>[] = []

  for (const table of SINGLE_ROW_TABLES) {
    const cacheKey = `row:${table}:${projectId}`
    if (queryCache.get(cacheKey) !== null) continue // already warm
    tasks.push(
      supabase
        .from(table)
        .select("*")
        .eq("project_id", projectId)
        .maybeSingle()
        .then(({ data }) => {
          if (data) queryCache.set(cacheKey, data as Record<string, unknown>)
        })
        .catch((err) => {
          console.warn(`[prefetch] ${table} failed`, err)
        }),
    )
  }

  // mood_board_items is a list
  const itemsCacheKey = `list:mood_board_items:${projectId}`
  if (queryCache.get(itemsCacheKey) === null) {
    tasks.push(
      supabase
        .from("mood_board_items")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true })
        .then(({ data }) => {
          if (data) queryCache.set(itemsCacheKey, data)
        })
        .catch((err) => {
          console.warn("[prefetch] mood_board_items failed", err)
        }),
    )
  }

  await Promise.allSettled(tasks)
}
