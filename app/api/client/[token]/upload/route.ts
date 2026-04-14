import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase-service"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// POST /api/client/[token]/upload — upload a single file to storage (public, service role)
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = createServiceRoleClient()

  // Validate token
  const { data: link } = await supabase
    .from("client_links")
    .select("id, project_id, is_active, expires_at")
    .eq("token", token)
    .maybeSingle()

  if (!link || !link.is_active || new Date(link.expires_at) < new Date()) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 410 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  const pageNameRaw = formData.get("pageName")
  const fieldLabelRaw = formData.get("fieldLabel")

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

  const sanitizePathPart = (value: string) =>
    value
      .trim()
      .replace(/[^a-zA-Z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80)

  // Sanitize filename
  const ext = file.name.split(".").pop() ?? "bin"
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 60)
  const pageName =
    typeof pageNameRaw === "string" && pageNameRaw.trim()
      ? sanitizePathPart(pageNameRaw) || "page"
      : null
  const fieldLabel =
    typeof fieldLabelRaw === "string" && fieldLabelRaw.trim()
      ? sanitizePathPart(fieldLabelRaw) || "field"
      : null
  const path =
    pageName && fieldLabel
      ? `${link.project_id}/${pageName}/${fieldLabel}/${Date.now()}_${safeName}.${ext}`
      : `${link.project_id}/${token}/${Date.now()}_${safeName}.${ext}`

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { error: uploadError } = await supabase.storage
    .from("client-uploads")
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    })

  if (uploadError) {
    console.error("[client-upload] error:", uploadError)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("client-uploads").getPublicUrl(path)

  return NextResponse.json({ url: publicUrl })
}
