import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; submissionId: string }> },
) {
  const { projectId, submissionId } = await params
  const body = await request.json()
  const { status } = body

  if (!["accepted", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", session.user.id)
    .maybeSingle()
  if (!project) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { data: submission, error: updateError } = await supabase
    .from("client_submissions")
    .update({ status })
    .eq("id", submissionId)
    .eq("project_id", projectId)
    .select()
    .single()

  if (updateError || !submission) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }

  if (status === "accepted") {
    await mapFieldToProject(supabase, session.user.id, projectId, submission as Record<string, unknown>)
  }

  return NextResponse.json({ submission })
}

async function mapFieldToProject(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase-server").createClient>>,
  userId: string,
  projectId: string,
  sub: Record<string, unknown>,
) {
  const key = sub.field_key as string
  const type = sub.field_type as string
  const text = sub.text_value as string | null
  const color = sub.color_value as string | null
  const fileUrl = sub.file_url as string | null
  const label = sub.field_label as string
  const pageName = sub.page_name as string | null

  // ── 0. selected_pages → sitemap (merge, no duplicates)
  if (key === "selected_pages" && text) {
    let incoming: { id: string; name: string }[] = []
    try {
      incoming = JSON.parse(text)
    } catch {
      return
    }
    if (!incoming.length) return

    const { data: sitemapRow } = await supabase
      .from("sitemap")
      .select("id, pages")
      .eq("project_id", projectId)
      .maybeSingle()

    const existingPages = Array.isArray(sitemapRow?.pages)
      ? (sitemapRow.pages as { id: string; name: string; path: string; blocks: unknown[]; children: unknown[] }[])
      : []

    const existingIds = new Set(existingPages.map((p) => p.id))

    const newPages = incoming
      .filter((p) => !existingIds.has(p.id))
      .map((p) => ({
        id: p.id,
        name: p.name,
        path: p.id === "home" ? "/" : `/${p.id}`,
        blocks: [],
        children: [],
      }))

    if (newPages.length === 0) return

    const merged = [...existingPages, ...newPages]

    if (sitemapRow) {
      await supabase.from("sitemap").update({ pages: merged }).eq("project_id", projectId)
    } else {
      await supabase.from("sitemap").insert({ project_id: projectId, user_id: userId, pages: merged, custom_blocks: [] })
    }
    return
  }

  // ── 1. Overview fields → project_overview table columns
  const overviewColMap: Record<string, string> = {
    business_name: "client_name",
    business_description: "description",
    project_goal: "project_goal",
    target_audience: "target_audience",
    primary_action: "primary_action",
  }
  if (overviewColMap[key] && text) {
    const col = overviewColMap[key]
    const { data: existing } = await supabase
      .from("project_overview")
      .select("id")
      .eq("project_id", projectId)
      .maybeSingle()
    if (existing) {
      await supabase.from("project_overview").update({ [col]: text }).eq("project_id", projectId)
    } else {
      await supabase.from("project_overview").insert({ project_id: projectId, user_id: userId, [col]: text })
    }
    return
  }

  // ── 2. Colour fields → style_guide.data.customColors
  const colorLabelMap: Record<string, string> = {
    brand_primary_color: "Primary",
    brand_secondary_color: "Secondary",
    brand_accent_color: "Accent",
  }
  if (colorLabelMap[key] && color) {
    const { data: sgRow } = await supabase.from("style_guide").select("id, data").eq("project_id", projectId).maybeSingle()
    const current = (sgRow?.data as Record<string, unknown>) ?? {}
    const colors = Array.isArray(current.customColors)
      ? (current.customColors as { id: string; label: string; value: string }[])
      : []
    const idx = colors.findIndex((c) => c.label === colorLabelMap[key])
    const entry = { id: idx >= 0 ? colors[idx].id : crypto.randomUUID(), label: colorLabelMap[key], value: color }
    if (idx >= 0) colors[idx] = entry
    else colors.push(entry)
    const updated = { ...current, customColors: colors }
    if (sgRow) {
      await supabase.from("style_guide").update({ data: updated }).eq("project_id", projectId)
    } else {
      await supabase.from("style_guide").insert({ project_id: projectId, user_id: userId, data: updated })
    }
    return
  }

  // ── 3. Style fields → content_section.data.brandMessaging / toneNotes
  if (key === "font_preference" && text) {
    const { data: row } = await supabase.from("content_section").select("id, data").eq("project_id", projectId).maybeSingle()
    const current = (row?.data as Record<string, unknown>) ?? {}
    const bm = (current.brandMessaging as Record<string, unknown>) ?? {}
    const updated = { ...current, brandMessaging: { ...bm, brandVoice: text } }
    if (row) {
      await supabase.from("content_section").update({ data: updated }).eq("project_id", projectId)
    } else {
      await supabase.from("content_section").insert({ project_id: projectId, user_id: userId, data: updated })
    }
    return
  }
  if (key === "brands_admired" && text) {
    const { data: row } = await supabase.from("content_section").select("id, data").eq("project_id", projectId).maybeSingle()
    const current = (row?.data as Record<string, unknown>) ?? {}
    const updated = { ...current, toneNotes: text }
    if (row) {
      await supabase.from("content_section").update({ data: updated }).eq("project_id", projectId)
    } else {
      await supabase.from("content_section").insert({ project_id: projectId, user_id: userId, data: updated })
    }
    return
  }
  if (key === "style_notes" && text) {
    const { data: row } = await supabase.from("content_section").select("id, data").eq("project_id", projectId).maybeSingle()
    const current = (row?.data as Record<string, unknown>) ?? {}
    const bm = (current.brandMessaging as Record<string, unknown>) ?? {}
    const updated = { ...current, brandMessaging: { ...bm, valueProposition: text } }
    if (row) {
      await supabase.from("content_section").update({ data: updated }).eq("project_id", projectId)
    } else {
      await supabase.from("content_section").insert({ project_id: projectId, user_id: userId, data: updated })
    }
    return
  }

  // ── 4. Page content → content_section.data.contentSnippets
  const pageSuffixes: Record<string, string> = {
    __headline: "heading",
    __subheadline: "subheading",
    __body: "body",
    __cta: "cta",
  }
  const matchedSuffix = Object.keys(pageSuffixes).find((s) => key.endsWith(s))
  if (matchedSuffix && text && pageName) {
    const snippetType = pageSuffixes[matchedSuffix]
    const { data: row } = await supabase.from("content_section").select("id, data").eq("project_id", projectId).maybeSingle()
    const current = (row?.data as Record<string, unknown>) ?? {}
    const snippets = Array.isArray(current.contentSnippets)
      ? (current.contentSnippets as { id: string; type: string; content: string; page?: string }[])
      : []
    snippets.push({ id: crypto.randomUUID(), type: snippetType, content: text, page: pageName })
    const updated = { ...current, contentSnippets: snippets }
    if (row) {
      await supabase.from("content_section").update({ data: updated }).eq("project_id", projectId)
    } else {
      await supabase.from("content_section").insert({ project_id: projectId, user_id: userId, data: updated })
    }
    return
  }

  // ── 5. All file uploads → asset_section.data.uploadedAssets
  if (type === "file" && fileUrl) {
    const assetLabel = pageName ? `${pageName} — ${label}` : label
    const { data: row } = await supabase.from("asset_section").select("id, data").eq("project_id", projectId).maybeSingle()
    const current = (row?.data as Record<string, unknown>) ?? {}
    const existing = Array.isArray(current.uploadedAssets)
      ? (current.uploadedAssets as { id: string; name: string; data: string; label: string }[])
      : []
    const updated = {
      ...current,
      uploadedAssets: [...existing, { id: crypto.randomUUID(), name: label, data: fileUrl, label: assetLabel }],
    }
    if (row) {
      await supabase.from("asset_section").update({ data: updated }).eq("project_id", projectId)
    } else {
      await supabase.from("asset_section").insert({ project_id: projectId, user_id: userId, data: updated })
    }
  }
}
