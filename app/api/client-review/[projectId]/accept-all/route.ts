import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

// POST /api/client-review/[projectId]/accept-all — accept all pending submissions and map to project
export async function POST(
  _: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params

  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Verify ownership
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", session.user.id)
    .maybeSingle()

  if (!project) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  // Fetch all pending submissions for this project
  const { data: submissions } = await supabase
    .from("client_submissions")
    .select("*")
    .eq("project_id", projectId)
    .eq("status", "pending")
    .eq("is_blank", false)

  if (!submissions?.length) {
    return NextResponse.json({ updated: 0 })
  }

  // Update all to accepted
  await supabase
    .from("client_submissions")
    .update({ status: "accepted" })
    .eq("project_id", projectId)
    .eq("status", "pending")

  // Batch map to project tables
  // Collect content items and assets to update in one operation each
  const contentItems: { id: string; type: string; text: string }[] = []
  const uploadedAssets: { id: string; name: string; data: string; label: string }[] = []

  for (const sub of submissions) {
    const { field_key, field_label, field_type, text_value, file_url } = sub

    if (field_type === "file" && file_url) {
      uploadedAssets.push({
        id: crypto.randomUUID(),
        name: field_label,
        data: file_url,
        label: field_label,
      })
    } else if (field_type !== "file" && text_value) {
      let contentType = "body"
      if (field_key.endsWith("_hero_headline")) contentType = "heading"
      else if (field_key.endsWith("_hero_subheadline")) contentType = "subheading"
      else if (field_key.endsWith("_cta_label")) contentType = "cta"
      contentItems.push({ id: crypto.randomUUID(), type: contentType, text: text_value })
    }
  }

  // Update content_section
  if (contentItems.length > 0) {
    const { data: contentRow } = await supabase
      .from("content_section")
      .select("id, data")
      .eq("project_id", projectId)
      .maybeSingle()

    const currentData = (contentRow?.data as Record<string, unknown>) ?? {}
    const existing = Array.isArray(currentData.contentItems)
      ? (currentData.contentItems as { id: string; type: string; text: string }[])
      : []
    const updated = { ...currentData, contentItems: [...existing, ...contentItems] }

    if (contentRow) {
      await supabase
        .from("content_section")
        .update({ data: updated, updated_at: new Date().toISOString() })
        .eq("project_id", projectId)
    } else {
      await supabase.from("content_section").insert({
        project_id: projectId,
        user_id: session.user.id,
        data: updated,
      })
    }
  }

  // Update asset_section
  if (uploadedAssets.length > 0) {
    const { data: assetRow } = await supabase
      .from("asset_section")
      .select("id, data")
      .eq("project_id", projectId)
      .maybeSingle()

    const currentData = (assetRow?.data as Record<string, unknown>) ?? {}
    const existing = Array.isArray(currentData.uploadedAssets)
      ? (currentData.uploadedAssets as { id: string; name: string; data: string; label: string }[])
      : []
    const updated = { ...currentData, uploadedAssets: [...existing, ...uploadedAssets] }

    if (assetRow) {
      await supabase
        .from("asset_section")
        .update({ data: updated, updated_at: new Date().toISOString() })
        .eq("project_id", projectId)
    } else {
      await supabase.from("asset_section").insert({
        project_id: projectId,
        user_id: session.user.id,
        data: updated,
      })
    }
  }

  return NextResponse.json({ updated: submissions.length })
}
