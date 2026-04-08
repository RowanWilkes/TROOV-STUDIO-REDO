import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

// GET /api/client-links?projectId=xxx — most recent link for a project
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("projectId")
  if (!projectId) return NextResponse.json({ error: "Missing projectId" }, { status: 400 })

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

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { data: link } = await supabase
    .from("client_links")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  return NextResponse.json({ link: link ?? null })
}

// POST /api/client-links — create a new client link (deactivates previous)
export async function POST(request: Request) {
  const body = await request.json()
  const { projectId, expiresAt, client_email } = body

  if (!projectId || !expiresAt) {
    return NextResponse.json({ error: "Missing projectId or expiresAt" }, { status: 400 })
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

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Deactivate any existing active links for this project
  await supabase
    .from("client_links")
    .update({ is_active: false })
    .eq("project_id", projectId)
    .eq("is_active", true)

  // Generate a long random URL-safe token
  const token =
    crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "")

  const email =
    typeof client_email === "string" && client_email.trim() ? client_email.trim() : null

  const { data: link, error } = await supabase
    .from("client_links")
    .insert({
      project_id: projectId,
      token,
      expires_at: expiresAt,
      is_active: true,
      client_email: email,
    })
    .select()
    .single()

  if (error) {
    console.error("[client-links] create error:", error)
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
  }

  return NextResponse.json({ link })
}
