import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params
  const body = await request.json()
  const { submissionId, note } = body as { submissionId?: string; note?: string }

  if (!submissionId || typeof note !== "string") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", session.user.id)
    .maybeSingle()
  if (!project) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { error } = await supabase
    .from("client_submissions")
    .update({ designer_note: note })
    .eq("id", submissionId)
    .eq("project_id", projectId)

  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 })

  return NextResponse.json({ success: true })
}

