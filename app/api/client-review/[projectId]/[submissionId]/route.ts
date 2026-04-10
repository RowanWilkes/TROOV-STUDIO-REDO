import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; submissionId: string }> },
) {
  const { projectId, submissionId } = await params
  const body = await request.json()
  const { action, note } = body

  if (!["accept", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: project } = await supabase
    .from("projects").select("id").eq("id", projectId).eq("user_id", session.user.id).maybeSingle()
  if (!project) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const nextStatus = action === "accept" ? "accepted" : "rejected"
  const update: Record<string, unknown> = { status: nextStatus }
  if (typeof note === "string") update.designer_note = note
  if (action === "reject") update.resubmission_requested = true

  const { data: submission, error: updateError } = await supabase
    .from("client_submissions")
    .update(update)
    .eq("id", submissionId)
    .eq("project_id", projectId)
    .select()
    .single()

  if (updateError || !submission) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }

  if (action === "accept") {
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

  // 0. selected_pages → sitemap
  if (key === "selected_pages" && text) {
    let incoming: { id: string; name: string }[] = []
    try { incoming = JSON.parse(text) } catch { return }
    if (!incoming.length) return
    const { data: sitemapRow } = await supabase
      .from("sitemap").select("id, pages").eq("project_id", projectId).maybeSingle()
    const existingPages = Array.isArray(sitemapRow?.pages)
      ? (sitemapRow.pages as { id: string; name: string; path: string; blocks: unknown[]; children: unknown[] }[])
      : []
    const existingIds = new Set(existingPages.map((p) => p.id))
    const newPages = incoming
      .filter((p) => !existingIds.has(p.id))
      .map((p) => ({ id: p.id, name: p.name, path: p.id === "home" ? "/" : `/${p.id}`, blocks: [], children: [] }))
    if (newPages.length === 0) return
    const merged = [...existingPages, ...newPages]
    if (sitemapRow) {
      await supabase.from("sitemap").update({ pages: merged }).eq("project_id", projectId)
    } else {
      await supabase.from("sitemap").insert({ project_id: projectId, user_id: userId, pages: merged, custom_blocks: [] })
    }
    return
  }

  // 1. Overview fields → project_overview columns
  const overviewColMap: Record<string, string> = {
    business_name: "client_name",
    business_description: "description",
    project_goal: "project_goal",
    target_audience: "target_audience",
    primary_action: "primary_action",
    launch_date: "launch_target",
  }
  if (overviewColMap[key] && text) {
    const col = overviewColMap[key]
    const { data: existing } = await supabase.from("project_overview").select("id").eq("project_id", projectId).maybeSingle()
    if (existing) {
      await supabase.from("project_overview").update({ [col]: text }).eq("project_id", projectId)
    } else {
      await supabase.from("project_overview").insert({ project_id: projectId, user_id: userId, [col]: text })
    }
    if (key === "business_name" && text) {
      await supabase
        .from("projects")
        .update({ title: text })
        .eq("id", projectId)
    }
    return
  }

  // 2. Colour fields → style_guide.data.standardColors
  const standardColorKeyMap: Record<string, string> = {
    brand_primary_color: "primary",
    brand_secondary_color: "secondary",
    brand_accent_color: "accent",
  }
  if (standardColorKeyMap[key] && color) {
    const { data: sgRow } = await supabase.from("style_guide").select("id, data").eq("project_id", projectId).maybeSingle()
    const current = (sgRow?.data as Record<string, unknown>) ?? {}
    const existingStandard = (current.standardColors as Record<string, string>) ?? {
      primary: "", secondary: "", accent: "", highlight: "", background: "", secondaryBackground: ""
    }
    const updatedStandard = { ...existingStandard, [standardColorKeyMap[key]]: color }
    const updated = { ...current, standardColors: updatedStandard }
    if (sgRow) {
      await supabase.from("style_guide").update({ data: updated }).eq("project_id", projectId)
    } else {
      await supabase.from("style_guide").insert({ project_id: projectId, user_id: userId, data: updated })
    }
    return
  }

  // 3. Style/brand notes → content_section
  if (key === "font_preference" && text) {
    const { data: row } = await supabase.from("content_section").select("id, data").eq("project_id", projectId).maybeSingle()
    const current = (row?.data as Record<string, unknown>) ?? {}
    const bm = (current.brandMessaging as Record<string, unknown>) ?? {}
    const updated = { ...current, brandMessaging: { ...bm, brandVoice: text } }
    if (row) { await supabase.from("content_section").update({ data: updated }).eq("project_id", projectId) }
    else { await supabase.from("content_section").insert({ project_id: projectId, user_id: userId, data: updated }) }
    return
  }
  if (key === "brand_feeling" && text) {
    const { data: row } = await supabase.from("content_section").select("id, data").eq("project_id", projectId).maybeSingle()
    const current = (row?.data as Record<string, unknown>) ?? {}
    const bm = (current.brandMessaging as Record<string, unknown>) ?? {}
    const existingVoice = typeof bm.brandVoice === "string" && bm.brandVoice ? bm.brandVoice : ""
    const combined = existingVoice
      ? `${existingVoice}\n\nDesired feeling: ${text}`
      : `Desired feeling: ${text}`
    const updated = { ...current, brandMessaging: { ...bm, brandVoice: combined } }
    if (row) { await supabase.from("content_section").update({ data: updated }).eq("project_id", projectId) }
    else { await supabase.from("content_section").insert({ project_id: projectId, user_id: userId, data: updated }) }
    return
  }
  if ((key === "brands_admired" || key.startsWith("brands_admired_")) && text) {
    const notesSeparator = "\n\nDesigner notes: "
    const separatorIndex = text.indexOf(notesSeparator)

    let rawUrl: string
    let clientNote: string | null

    if (separatorIndex !== -1) {
      rawUrl = text.substring(0, separatorIndex).trim()
      clientNote = text.substring(separatorIndex + notesSeparator.length).trim() || null
    } else {
      rawUrl = text.trim()
      clientNote = null
    }

    if (!rawUrl) return

    const url = rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `https://${rawUrl}`

    await supabase.from("mood_board_items").insert({
      project_id: projectId,
      user_id: userId,
      type: "website_reference",
      url: url,
      title: rawUrl,
      notes: clientNote ?? "Added from client link",
    })
    return
  }
  if (key === "style_notes" && text) {
    const { data: row } = await supabase.from("content_section").select("id, data").eq("project_id", projectId).maybeSingle()
    const current = (row?.data as Record<string, unknown>) ?? {}
    const updated = { ...current, toneNotes: text }
    if (row) { await supabase.from("content_section").update({ data: updated }).eq("project_id", projectId) }
    else { await supabase.from("content_section").insert({ project_id: projectId, user_id: userId, data: updated }) }
    return
  }
  if (key === "tagline" && text) {
    const { data: row } = await supabase.from("content_section").select("id, data").eq("project_id", projectId).maybeSingle()
    const current = (row?.data as Record<string, unknown>) ?? {}
    const bm = (current.brandMessaging as Record<string, unknown>) ?? {}
    const updated = { ...current, brandMessaging: { ...bm, tagline: text } }
    if (row) { await supabase.from("content_section").update({ data: updated }).eq("project_id", projectId) }
    else { await supabase.from("content_section").insert({ project_id: projectId, user_id: userId, data: updated }) }
    return
  }
  if (key === "mission_statement" && text) {
    const { data: row } = await supabase.from("content_section").select("id, data").eq("project_id", projectId).maybeSingle()
    const current = (row?.data as Record<string, unknown>) ?? {}
    const bm = (current.brandMessaging as Record<string, unknown>) ?? {}
    const updated = { ...current, brandMessaging: { ...bm, missionStatement: text } }
    if (row) { await supabase.from("content_section").update({ data: updated }).eq("project_id", projectId) }
    else { await supabase.from("content_section").insert({ project_id: projectId, user_id: userId, data: updated }) }
    return
  }

  if (type === "file" && fileUrl && key.startsWith("inspiration_image_")) {
    await supabase.from("mood_board_items").insert({
      project_id: projectId,
      user_id: userId,
      type: "image",
      url: fileUrl,
      title: "Inspiration Screenshot",
      notes: "Added from client link",
    })
    return
  }

  if (key.startsWith("inspiration_note_") && text) {
    const { data: lastImage } = await supabase
      .from("mood_board_items")
      .select("id")
      .eq("project_id", projectId)
      .eq("type", "image")
      .eq("notes", "Added from client link")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    if (lastImage) {
      await supabase
        .from("mood_board_items")
        .update({ notes: text })
        .eq("id", lastImage.id)
    }
    return
  }

  // 4. All file uploads → asset_section.data.uploadedAssets
  if (type === "file" && fileUrl) {
    const assetLabel = label
    const { data: row } = await supabase.from("asset_section").select("id, data").eq("project_id", projectId).maybeSingle()
    const current = (row?.data as Record<string, unknown>) ?? {}
    const existing = Array.isArray(current.uploadedAssets)
      ? (current.uploadedAssets as { id: string; name: string; data: string; label: string }[])
      : []
    const updated = { ...current, uploadedAssets: [...existing, { id: crypto.randomUUID(), name: label, data: fileUrl, label: assetLabel }] }
    if (row) { await supabase.from("asset_section").update({ data: updated }).eq("project_id", projectId) }
    else { await supabase.from("asset_section").insert({ project_id: projectId, user_id: userId, data: updated }) }
  }
}
