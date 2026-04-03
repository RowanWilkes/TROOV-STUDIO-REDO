import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

// PATCH /api/client-review/[projectId]/[submissionId] — accept or reject a submission field
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; submissionId: string }> },
) {
  const { projectId, submissionId } = await params
  const body = await request.json()
  const { status } = body // "accepted" | "rejected"

  if (!["accepted", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

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

  // Update submission status
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

  // If accepted, map the field to the project tables
  if (status === "accepted") {
    await mapFieldToProject(supabase, session.user.id, projectId, submission)
  }

  return NextResponse.json({ submission })
}

async function mapFieldToProject(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase-server").createClient>>,
  userId: string,
  projectId: string,
  submission: {
    field_key: string
    field_label: string
    field_type: string
    text_value: string | null
    file_url: string | null
    page_name: string | null
  },
) {
  const { field_key, field_label, field_type, text_value, file_url } = submission

  // Determine content type from field key
  const isLogoOrBrand =
    field_key.endsWith("_logo") || field_key.startsWith("brand_asset")
  const isImage = field_key.endsWith("_image")

  if (field_type === "file" && (isLogoOrBrand || isImage) && file_url) {
    // Map to asset_section.data.uploadedAssets
    const { data: assetRow } = await supabase
      .from("asset_section")
      .select("id, data")
      .eq("project_id", projectId)
      .maybeSingle()

    const currentData = (assetRow?.data as Record<string, unknown>) ?? {}
    const existing = Array.isArray(currentData.uploadedAssets)
      ? (currentData.uploadedAssets as { id: string; name: string; data: string; label: string }[])
      : []

    const newAsset = {
      id: crypto.randomUUID(),
      name: field_label,
      data: file_url, // store public URL in data field
      label: field_label,
    }

    const updated = { ...currentData, uploadedAssets: [...existing, newAsset] }

    if (assetRow) {
      await supabase
        .from("asset_section")
        .update({ data: updated, updated_at: new Date().toISOString() })
        .eq("project_id", projectId)
    } else {
      await supabase.from("asset_section").insert({
        project_id: projectId,
        user_id: userId,
        data: updated,
      })
    }
    return
  }

  // Map text fields to content_section.data.contentItems
  if (field_type !== "file" && text_value) {
    let contentType: string = "body"
    if (field_key.endsWith("_hero_headline")) contentType = "heading"
    else if (field_key.endsWith("_hero_subheadline")) contentType = "subheading"
    else if (field_key.endsWith("_cta_label")) contentType = "cta"

    const { data: contentRow } = await supabase
      .from("content_section")
      .select("id, data")
      .eq("project_id", projectId)
      .maybeSingle()

    const currentData = (contentRow?.data as Record<string, unknown>) ?? {}
    const existing = Array.isArray(currentData.contentItems)
      ? (currentData.contentItems as { id: string; type: string; text: string }[])
      : []

    const newItem = {
      id: crypto.randomUUID(),
      type: contentType,
      text: text_value,
    }

    const updated = { ...currentData, contentItems: [...existing, newItem] }

    if (contentRow) {
      await supabase
        .from("content_section")
        .update({ data: updated, updated_at: new Date().toISOString() })
        .eq("project_id", projectId)
    } else {
      await supabase.from("content_section").insert({
        project_id: projectId,
        user_id: userId,
        data: updated,
      })
    }
  }
}
