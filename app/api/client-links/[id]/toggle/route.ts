import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

// PATCH /api/client-links/[id]/toggle — flip is_active on a link
export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: link } = await supabase
    .from("client_links")
    .select("id, is_active, project_id")
    .eq("id", id)
    .maybeSingle()

  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Verify ownership
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", link.project_id)
    .eq("user_id", session.user.id)
    .maybeSingle()

  if (!project) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { data: updated, error } = await supabase
    .from("client_links")
    .update({ is_active: !link.is_active })
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 })

  return NextResponse.json({ link: updated })
}
