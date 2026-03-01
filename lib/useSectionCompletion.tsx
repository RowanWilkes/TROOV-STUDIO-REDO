"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  hasOverviewContent,
  hasMoodBoardContent,
  hasStyleGuideContent,
  hasSitemapContent,
  hasTechnicalContent,
  hasContentSectionContent,
  hasAssetsContent,
  hasTasksCompletion,
} from "@/lib/summary/hasContent"

export interface SectionCompletionMap {
  overview: boolean
  mood: boolean
  styleguide: boolean
  wireframe: boolean
  technical: boolean
  content: boolean
  assets: boolean
  tasks: boolean
}

const EMPTY_MAP: SectionCompletionMap = {
  overview: false,
  mood: false,
  styleguide: false,
  wireframe: false,
  technical: false,
  content: false,
  assets: false,
  tasks: false,
}

const SECTION_IDS = [
  "overview",
  "mood",
  "styleguide",
  "wireframe",
  "technical",
  "content",
  "assets",
  "tasks",
] as const

export type SectionId = (typeof SECTION_IDS)[number]

/** Fetch and compute content-based section completion, then merge with overrides. */
export async function fetchSectionCompletion(projectId: string): Promise<SectionCompletionMap> {
  const [
    { data: overviewRow },
    { data: moodBoardRow },
    { data: moodBoardItems },
    { data: styleGuideRow },
    { data: sitemapRow },
    { data: technicalRow },
    { data: contentRow },
    { data: assetRow },
    { data: tasksData },
  ] = await Promise.all([
    supabase.from("project_overview").select("*").eq("project_id", projectId).maybeSingle(),
    supabase.from("mood_board").select("*").eq("project_id", projectId).maybeSingle(),
    supabase
      .from("mood_board_items")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true }),
    supabase.from("style_guide").select("*").eq("project_id", projectId).maybeSingle(),
    supabase.from("sitemap").select("*").eq("project_id", projectId).maybeSingle(),
    supabase.from("technical_specs").select("*").eq("project_id", projectId).maybeSingle(),
    supabase.from("content_section").select("*").eq("project_id", projectId).maybeSingle(),
    supabase.from("asset_section").select("*").eq("project_id", projectId).maybeSingle(),
    supabase.from("tasks").select("id, completed").eq("project_id", projectId),
  ])

  const row = overviewRow as Record<string, unknown> | null
  const overview = row
    ? {
        projectName: row.project_name ?? row.name ?? "",
        client: row.client_name ?? row.client ?? "",
        description: row.description ?? "",
        goal: row.project_goal ?? row.goal ?? "",
        primaryAction: row.primary_action ?? "",
        audience: row.target_audience ?? row.audience ?? "",
        deadline: row.launch_target ?? row.deadline ?? "",
        budget: row.budget_range ?? row.budget ?? "",
        constraints: row.constraints_requirements ?? row.constraints ?? "",
        successMetrics: row.success_criteria ?? row.success_metrics ?? "",
        kpis: row.kpis ?? "",
        kickoffDate: row.kickoff_date ?? "",
        priorityLevel: row.priority_level ?? "Medium",
        estimatedDevTime: row.estimated_dev_time ?? "",
        teamMembers: row.team_members ?? "",
        clientReviewDate: row.client_review_date ?? "",
        projectType: row.project_type ?? "",
        websiteFeatures: Array.isArray(row.website_features_required)
          ? row.website_features_required
          : Array.isArray(row.website_features)
            ? row.website_features
            : [],
        deliverables: row.deliverables ?? "",
      }
    : {}

  const inspirationImages = (moodBoardItems ?? [])
    .filter((r: { type?: string }) => r.type === "image")
    .map((r: { id?: string; url?: string; title?: string; notes?: string }) => ({
      id: r.id,
      url: r.url,
      title: r.title,
      notes: r.notes,
    }))
  const websiteReferences = (moodBoardItems ?? [])
    .filter((r: { type?: string }) => r.type === "website_reference")
    .map((r: { id?: string; url?: string; title?: string; notes?: string }) => ({
      id: r.id,
      url: r.url,
      title: r.title,
      notes: r.notes,
    }))
  const moodBoard = {
    inspirationImages,
    websiteReferences,
    notes: moodBoardRow?.style_notes != null ? String(moodBoardRow.style_notes) : "",
  }

  const styleGuideRaw = (styleGuideRow?.data as Record<string, unknown>) ?? {}
  const styleGuide = {
    colors: styleGuideRaw.standardColors ?? {},
    customColors: styleGuideRaw.customColors ?? [],
    typography: styleGuideRaw.typography ?? [],
    buttonStyles: styleGuideRaw.buttonStyles ?? {},
  }

  const sitemapPages = Array.isArray(sitemapRow?.pages) ? (sitemapRow.pages as unknown[]) : []

  const tr = technicalRow as Record<string, unknown> | null
  const technical = tr
    ? {
        currentHosting: tr.current_hosting ?? "",
        hostingNotes: tr.hosting_notes ?? "",
        proposedHosting: tr.proposed_hosting ?? "",
        cms: tr.cms ?? "",
        contentUpdateFrequency: tr.content_update_frequency ?? "",
        contentManagers: tr.content_managers ?? "",
        editableContent: tr.editable_content ?? "",
        thirdPartyIntegrations: tr.third_party_integrations ?? "",
        technicalRequirements: tr.technical_requirements ?? "",
        performanceRequirements: tr.performance_requirements ?? "",
        browserSupport: tr.browser_support ?? "",
        seoRequirements: tr.seo_requirements ?? "",
      }
    : {}

  const content = (contentRow?.data as Record<string, unknown>) ?? {}

  const assetsRaw = (assetRow?.data as Record<string, unknown>) ?? {}
  const assets = Array.isArray(assetsRaw.uploadedAssets) ? assetsRaw.uploadedAssets : []

  const tasks = (tasksData ?? []) as Array<{ completed?: boolean }>

  const contentBased: SectionCompletionMap = {
    overview: hasOverviewContent(overview),
    mood: hasMoodBoardContent(moodBoard),
    styleguide: hasStyleGuideContent(styleGuide),
    wireframe: hasSitemapContent(sitemapPages),
    technical: hasTechnicalContent(technical),
    content: hasContentSectionContent(content),
    assets: hasAssetsContent({ uploadedAssets: assets }),
    tasks: hasTasksCompletion(tasks),
  }

  const { data: overridesRows } = await supabase
    .from("section_completion_overrides")
    .select("section, is_complete")
    .eq("project_id", projectId)

  const overrideBySection = new Map<string, boolean>()
  for (const row of overridesRows ?? []) {
    const r = row as { section: string; is_complete: boolean }
    overrideBySection.set(r.section, r.is_complete)
  }

  const merged: SectionCompletionMap = { ...EMPTY_MAP }
  for (const id of SECTION_IDS) {
    if (id === "tasks") {
      merged[id] = contentBased[id]
    } else {
      const override = overrideBySection.get(id)
      merged[id] = override === true ? true : contentBased[id]
    }
  }
  return merged
}

export interface SectionCompletionContextValue {
  projectId: string | null
  completion: SectionCompletionMap
  completedCount: number
  completionPercentage: number
  setOverride: (section: SectionId, isComplete: boolean) => Promise<void>
  refetchCompletion: () => Promise<void>
}

const SectionCompletionContext = createContext<SectionCompletionContextValue | null>(null)

export function useSectionCompletionContext(): SectionCompletionContextValue | null {
  return useContext(SectionCompletionContext)
}

export function SectionCompletionProvider({
  projectId,
  children,
}: {
  projectId: string | null
  children: React.ReactNode
}) {
  const [completion, setCompletion] = useState<SectionCompletionMap>(EMPTY_MAP)

  const refetchCompletion = useCallback(async () => {
    if (!projectId) return
    const map = await fetchSectionCompletion(projectId)
    setCompletion(map)
  }, [projectId])

  useEffect(() => {
    if (!projectId) {
      setCompletion(EMPTY_MAP)
      return
    }
    let cancelled = false
    fetchSectionCompletion(projectId).then((map) => {
      if (!cancelled) setCompletion(map)
    })
    return () => {
      cancelled = true
    }
  }, [projectId])

  const setOverride = useCallback(
    async (section: SectionId, isComplete: boolean) => {
      if (!projectId) return
      setCompletion((prev) => ({ ...prev, [section]: isComplete }))
      await supabase.from("section_completion_overrides").upsert(
        { project_id: projectId, section, is_complete: isComplete, updated_at: new Date().toISOString() },
        { onConflict: "project_id,section" },
      )
    },
    [projectId],
  )

  const completedCount = SECTION_IDS.filter((id) => completion[id]).length
  const completionPercentage = SECTION_IDS.length > 0 ? Math.round((completedCount / SECTION_IDS.length) * 100) : 0

  const value: SectionCompletionContextValue = {
    projectId,
    completion,
    completedCount,
    completionPercentage,
    setOverride,
    refetchCompletion,
  }

  return (
    <SectionCompletionContext.Provider value={value}>{children}</SectionCompletionContext.Provider>
  )
}

export function useSectionCompletion(projectId: string | null): {
  completion: SectionCompletionMap
  completedCount: number
  completionPercentage: number
  setOverride: (section: SectionId, isComplete: boolean) => Promise<void>
} {
  const context = useSectionCompletionContext()
  const [completion, setCompletion] = useState<SectionCompletionMap>(EMPTY_MAP)

  useEffect(() => {
    if (!projectId) {
      setCompletion(EMPTY_MAP)
      return
    }
    let cancelled = false
    fetchSectionCompletion(projectId).then((map) => {
      if (!cancelled) setCompletion(map)
    })
    return () => {
      cancelled = true
    }
  }, [projectId])

  const setOverride = useCallback(
    async (section: SectionId, isComplete: boolean) => {
      if (!projectId) return
      setCompletion((prev) => ({ ...prev, [section]: isComplete }))
      await supabase.from("section_completion_overrides").upsert(
        { project_id: projectId, section, is_complete: isComplete, updated_at: new Date().toISOString() },
        { onConflict: "project_id,section" },
      )
    },
    [projectId],
  )

  const completedCount = SECTION_IDS.filter((id) => completion[id]).length
  const completionPercentage = SECTION_IDS.length > 0 ? Math.round((completedCount / SECTION_IDS.length) * 100) : 0

  if (context && context.projectId === projectId) {
    return {
      completion: context.completion,
      completedCount: context.completedCount,
      completionPercentage: context.completionPercentage,
      setOverride: context.setOverride,
    }
  }

  return {
    completion,
    completedCount,
    completionPercentage,
    setOverride,
  }
}
