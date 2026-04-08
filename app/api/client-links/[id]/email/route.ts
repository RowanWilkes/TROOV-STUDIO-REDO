import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const raw = body.client_email
  const client_email =
    typeof raw === "string" ? (raw.trim() === "" ? null : raw.trim()) : null

  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: link } = await supabase
    .from("client_links")
    .select("id, project_id")
    .eq("id", id)
    .maybeSingle()

  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", link.project_id)
    .eq("user_id", session.user.id)
    .maybeSingle()

  if (!project) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { error } = await supabase.from("client_links").update({ client_email }).eq("id", id)

  if (error) {
    console.error("[client-links/email]", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
