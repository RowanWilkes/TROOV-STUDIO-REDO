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

    // Best-effort: store a copy in Supabase Storage and record in downloaded_summaries,
    // then return a signed URL that the client can use to download.
    try {
      const objectPath = `${user.id}/${projectId}/${Date.now()}-${safeName}.pdf`
      const { error: uploadError } = await supabase.storage.from("summaries").upload(objectPath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: false,
      })

      if (uploadError) {
        console.error("[summary-pdf] storage upload error:", uploadError)
        return NextResponse.json({ error: "Failed to store PDF" }, { status: 500 })
      }

      const { error: insertError } = await supabase
        .from("downloaded_summaries")
        .upsert(
          {
            user_id: user.id,
            project_id: (project as { id: string }).id,
            file_path: objectPath,
            file_name: filename,
            is_client_copy: false,
            created_at: new Date().toISOString(),
          },
          { onConflict: "user_id,project_id" },
        )
      if (insertError) {
        console.error("[summary-pdf] insert downloaded_summaries error:", insertError)
      }

      const { data: signed, error: signedError } = await supabase.storage
        .from("summaries")
        .createSignedUrl(objectPath, 60)

      if (signedError || !signed?.signedUrl) {
        console.error("[summary-pdf] createSignedUrl error:", signedError)
        return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 })
      }

      return NextResponse.json({ signedUrl: signed.signedUrl, filename }, { status: 200 })
    } catch (recordErr) {
      console.error("[summary-pdf] failed to record downloaded summary or create URL:", recordErr)
      return NextResponse.json({ error: "Failed to generate PDF. Please try again." }, { status: 500 })
    }
  } catch (err) {
    console.error("[summary-pdf] FULL ERROR:", err)
    console.error("[summary-pdf] MESSAGE:", err instanceof Error ? err.message : String(err))
    console.error("[summary-pdf] STACK:", err instanceof Error ? err.stack : "no stack")
    return NextResponse.json(
      { error: "Failed to generate PDF. Please try again." },
      { status: 500 }
    )
  }
}
