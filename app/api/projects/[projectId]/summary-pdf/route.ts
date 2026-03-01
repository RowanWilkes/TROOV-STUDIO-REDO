import React from "react"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { getProjectSummaryData } from "@/lib/summary/getProjectSummaryData"
import { ProjectSummaryPdf } from "@/components/pdf/ProjectSummaryPdf"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    if (!projectId) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      console.log("summary-pdf unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, user_id, title, created_at")
      .eq("id", projectId)
      .maybeSingle()

    if (projectError) {
      console.error("[summary-pdf] project fetch error:", projectError)
      return NextResponse.json({ error: "Failed to load project" }, { status: 500 })
    }

    if (!project || (project as { user_id: string }).user_id !== user.id) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const data = await getProjectSummaryData(supabase, projectId)
    const projectName = (project as { title?: string }).title ?? undefined
    const createdAt = (project as { created_at?: string }).created_at ?? undefined

    const element = React.createElement(ProjectSummaryPdf, {
      data,
      projectName,
      createdAt,
    })

    const { pdf } = await import("@react-pdf/renderer")
    const pdfBuffer = await pdf(element).toBuffer()

    const safeName = (projectName || projectId).replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-") || "summary"
    const filename = `troov-summary-${safeName}.pdf`

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error("[summary-pdf] error:", err)
    return NextResponse.json(
      { error: "Failed to generate PDF. Please try again." },
      { status: 500 }
    )
  }
}
