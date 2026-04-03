import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

// GET /api/client-review/[projectId] — fetch submissions for the latest submitted link
export async function GET(_: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params

  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Verify ownership
  const { data: project } = await supabase
    .from("projects")
    .select("id, title")
    .eq("id", projectId)
    .eq("user_id", session.user.id)
    .maybeSingle()

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Get the most recent submitted link
  const { data: link } = await supabase
    .from("client_links")
    .select("id, submitted_at, expires_at, is_active")
    .eq("project_id", projectId)
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!link) return NextResponse.json({ link: null, submissions: [] })

  const { data: submissions } = await supabase
    .from("client_submissions")
    .select("*")
    .eq("client_link_id", link.id)
    .order("created_at", { ascending: true })

  return NextResponse.json({ link, submissions: submissions ?? [] })
}
