import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase-service"
import { Resend } from "resend"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const resend = new Resend(process.env.RESEND_API_KEY)

type FieldSubmission = {
  fieldKey: string
  fieldLabel: string
  fieldType: "text" | "longtext" | "file" | "color"
  pageName: string | null
  stepId?: string | null
  textValue: string | null
  colorValue?: string | null
  fileUrl: string | null
  isBlank: boolean
}

// POST /api/client/[token]/submit — submit all field values (public, service role)
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = createServiceRoleClient()

  // Validate token
  const { data: link } = await supabase
    .from("client_links")
    .select("id, project_id, is_active, expires_at, submitted_at")
    .eq("token", token)
    .maybeSingle()

  if (!link || !link.is_active || new Date(link.expires_at) < new Date()) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 410 })
  }

  if (link.submitted_at) {
    return NextResponse.json({ error: "Already submitted" }, { status: 409 })
  }

  const body = await request.json()
  const fields: FieldSubmission[] = body.fields ?? []

  if (!fields.length) {
    return NextResponse.json({ error: "No fields provided" }, { status: 400 })
  }

  // Insert one submission row per field
  const rows = fields.map((f) => ({
    client_link_id: link.id,
    project_id: link.project_id,
    field_key: f.fieldKey,
    field_label: f.fieldLabel,
    field_type: f.fieldType,
    text_value: f.textValue,
    file_url: f.fileUrl,
    page_name: f.pageName,
    step_id: f.stepId ?? null,
    color_value: f.colorValue ?? null,
    section_name: null,
    is_blank: f.isBlank,
    status: "pending",
  }))

  const { error: insertError } = await supabase.from("client_submissions").insert(rows)

  if (insertError) {
    console.error("[client-submit] insert error:", insertError)
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 })
  }

  // Mark link as submitted
  await supabase
    .from("client_links")
    .update({ submitted_at: new Date().toISOString() })
    .eq("id", link.id)

  // Fetch project + owner for notifications
  const { data: project } = await supabase
    .from("projects")
    .select("title, user_id")
    .eq("id", link.project_id)
    .maybeSingle()

  const projectName = project?.title ?? "Your project"
  const userId = project?.user_id

  if (userId) {
    // Email notification
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.admin.getUserById(userId)
      const userEmail = authUser?.email
      if (userEmail) {
        await resend.emails.send({
          from: "Troov Studio <contact@troov-marketing.com>",
          to: userEmail,
          subject: `Your client has submitted their content for ${projectName}`,
          html: `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
  <h1 style="font-size:20px;font-weight:700;color:#111827;">Client content submitted</h1>
  <p style="color:#6b7280;font-size:15px;line-height:1.6;">
    Your client has submitted their content for <strong>${projectName}</strong>.
    You can now review and accept or reject each field.
  </p>
  <p style="color:#6b7280;font-size:15px;">
    <a href="https://www.troovstudio.com/dashboard/${link.project_id}/client-review" style="color:#059669;font-weight:600;">Review submission →</a>
  </p>
  <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0;">
  <p style="color:#d1d5db;font-size:12px;">Troov Studio · troovstudio.com</p>
</div>`,
        })
      }
    } catch (emailErr) {
      console.error("[client-submit] email error:", emailErr)
    }

    // In-app notification
    try {
      await supabase.from("notifications").insert({
        user_id: userId,
        project_id: link.project_id,
        type: "client_submission",
        title: "Client content submitted",
        body: `${projectName} — your client has submitted their content. Review it now.`,
        url: `/dashboard/${link.project_id}/client-review`,
        is_read: false,
      })
    } catch (notifErr) {
      console.error("[client-submit] notification error:", notifErr)
    }
  }

  return NextResponse.json({ success: true })
}
