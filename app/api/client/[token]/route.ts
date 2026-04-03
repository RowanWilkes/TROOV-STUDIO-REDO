import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase-service"

export const dynamic = "force-dynamic"

// GET /api/client/[token] — validate token and return project + sitemap data (public)
export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = createServiceRoleClient()

  const { data: link } = await supabase
    .from("client_links")
    .select("id, project_id, expires_at, is_active, submitted_at")
    .eq("token", token)
    .maybeSingle()

  if (!link) {
    return NextResponse.json({ error: "invalid" }, { status: 404 })
  }

  if (!link.is_active || new Date(link.expires_at) < new Date()) {
    return NextResponse.json({ error: "inactive" }, { status: 410 })
  }

  const [{ data: project }, { data: sitemap }] = await Promise.all([
    supabase.from("projects").select("id, title").eq("id", link.project_id).maybeSingle(),
    supabase.from("sitemap").select("pages").eq("project_id", link.project_id).maybeSingle(),
  ])

  const rawPages = sitemap?.pages
  const pages = Array.isArray(rawPages) && rawPages.length > 0
    ? rawPages
    : [{ id: "home", name: "Home", path: "/" }]

  return NextResponse.json({
    linkId: link.id,
    projectId: link.project_id,
    projectName: project?.title ?? "Your Project",
    expiresAt: link.expires_at,
    submittedAt: link.submitted_at,
    pages,
  })
}
