import type { SupabaseClient } from "@supabase/supabase-js"
import type { SummaryData } from "./types"

/**
 * Fetches and normalizes all summary data for a project (same shape as Design Summary UI).
 * Used by the PDF API route; client Summary page keeps its own loadData() for initial load.
 */
export async function getProjectSummaryData(
  supabase: SupabaseClient,
  projectId: string
): Promise<SummaryData> {
  const [
    { data: projectRow },
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
    supabase.from("projects").select("title, created_at").eq("id", projectId).maybeSingle(),
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
    supabase.from("tasks").select("id, title, completed, sort_order").eq("project_id", projectId).order("sort_order", { ascending: true }),
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
  const organizedAssets: Record<string, unknown[]> = {}
  assets.forEach((asset: Record<string, unknown>) => {
    const category = (asset.category as string) || "Uncategorized"
    if (!organizedAssets[category]) organizedAssets[category] = []
    organizedAssets[category].push(asset)
  })

  const tasks = (tasksData ?? []).map((t: { id?: string; title?: string; completed?: boolean; sort_order?: number }) => ({
    id: t.id,
    title: String(t.title ?? ""),
    completed: Boolean(t.completed),
    order: Number(t.sort_order ?? 0),
  }))

  const project = projectRow as { title?: string; created_at?: string } | null

  return {
    overview,
    moodBoard,
    styleGuide,
    sitemapPages,
    technical,
    content,
    assets: { uploadedAssets: assets, tabs: organizedAssets },
    tasks,
    projectTitle: project?.title ?? undefined,
    projectCreatedAt: project?.created_at ?? undefined,
  }
}
