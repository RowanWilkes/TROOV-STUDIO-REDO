import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { createServiceRoleClient } from "@/lib/supabase-service"
import { Resend } from "resend"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    console.log("[send-feedback] resend key present:", Boolean(process.env.RESEND_API_KEY))

    const supabaseAuth = await createClient()
    const {
      data: { session },
    } = await supabaseAuth.auth.getSession()
    if (!session?.user?.id) {
      console.log("[send-feedback] auth check", { authenticated: false })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.log("[send-feedback] auth check", { userId: session.user.id })

    const { projectId } = await params
    const supabaseAdmin = createServiceRoleClient()

    const { data: project } = await supabaseAdmin
      .from("projects")
      .select("id, title, user_id")
      .eq("id", projectId)
      .maybeSingle()
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (project.user_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    console.log("[send-feedback] project found", { projectId: project.id })

    const { data: rejected, error: rejectedError } = await supabaseAdmin
      .from("client_submissions")
      .select("id, field_key, field_label, designer_note, status")
      .eq("project_id", projectId)
      .eq("status", "rejected")
      .order("created_at", { ascending: true })

    if (rejectedError) {
      console.log("[send-feedback] rejected submissions query error", rejectedError)
      return NextResponse.json({ error: rejectedError.message }, { status: 500 })
    }

    const rejectedRows = (rejected ?? []) as Array<{
      id: string
      field_key: string
      field_label: string
      designer_note: string | null
      status: string
    }>
    console.log("[send-feedback] rejected submissions", {
      count: rejectedRows.length,
      field_keys: rejectedRows.map((r) => r.field_key),
      ids: rejectedRows.map((r) => r.id),
    })

    if (rejectedRows.length === 0) {
      return NextResponse.json({ error: "No rejected fields" }, { status: 400 })
    }

    const { data: link, error: linkError } = await supabaseAdmin
      .from("client_links")
      .select("token, client_email")
      .eq("project_id", projectId)
      .eq("is_active", true)
      .maybeSingle()

    if (linkError) {
      console.error("[send-feedback] client_links", linkError)
      return NextResponse.json({ error: linkError.message }, { status: 500 })
    }
    console.log("[send-feedback] client link", {
      hasToken: Boolean(link?.token),
      tokenPreview: link?.token ? `${String(link.token).slice(0, 8)}…` : null,
      client_email: link?.client_email ? "[set]" : null,
      rawClientEmailLength: String(link?.client_email ?? "").length,
    })

    if (!link?.token) {
      return NextResponse.json(
        { error: "No active client link found for this project" },
        { status: 400 },
      )
    }

    const rejectedFieldKeys = rejectedRows.map((r) => r.field_key)
    const origin = request.headers.get("origin") || "http://localhost:3000"
    const resubmitUrl = `${origin}/client/${link.token}?resubmit=true&fields=${rejectedFieldKeys.join(",")}`
    console.log("[send-feedback] resubmit url built", { resubmitUrl })

    const clientEmail = String(link.client_email ?? "").trim()
    if (!clientEmail) {
      console.log("[send-feedback] no client email — skipping Resend")
      return NextResponse.json({
        success: true,
        emailSent: false,
        resubmitUrl,
        message: "No client email on file. Share the link below with your client manually.",
      })
    }

    const projectName = project.title ?? "Your project"

    console.log("[send-feedback] about to send email", {
      to: clientEmail,
      rejectedCount: rejectedRows.length,
    })

    const resendResult = await resend.emails.send({
      from: "Troov Studio <contact@troov-marketing.com>",
      to: clientEmail,
      subject: `Your designer needs a few more details — ${projectName}`,
      html: `
<div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
  <h1 style="font-size:20px; font-weight:700; color:#111827; margin:0 0 8px;">Your designer has reviewed your submission</h1>
  <p style="color:#6b7280; font-size:14px; line-height:1.6; margin:0 0 16px;">They need you to update the following:</p>

  <div style="border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
    ${rejectedRows
      .map((r) => {
        const note = (r.designer_note ?? "").trim()
        return `
          <div style="padding:14px 16px; border-top:1px solid #f3f4f6;">
            <div style="font-weight:600; color:#111827; font-size:14px; margin:0 0 6px;">${escapeHtml(r.field_label)}</div>
            ${note ? `<div style="color:#6b7280; font-size:13px; line-height:1.5;">${escapeHtml(note)}</div>` : ""}
          </div>
        `
      })
      .join("")}
  </div>

  <div style="margin:20px 0 12px;">
    <a href="${escapeHtmlAttr(resubmitUrl)}" style="display:inline-block; background:#16a34a; color:#ffffff; text-decoration:none; padding:12px 16px; border-radius:10px; font-weight:700; font-size:14px;">
      Update My Submission
    </a>
  </div>

  <p style="color:#9ca3af; font-size:12px; line-height:1.6; margin:0;">
    You can skip anything you're unsure about and your designer will follow up.
  </p>
</div>`,
    })

    console.log("[send-feedback] resend response", resendResult)

    if (resendResult.error) {
      console.log("[send-feedback] resend error", resendResult.error)
      return NextResponse.json(
        {
          success: false,
          emailSent: false,
          resubmitUrl,
          error: resendResult.error.message,
          debug: {
            resendResponse: resendResult.data,
            resendError: resendResult.error,
          },
        },
        { status: 502 },
      )
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
      resubmitUrl,
      debug: {
        resendResponse: resendResult.data,
        resendError: null,
      },
    })
  } catch (err) {
    console.error("[send-feedback]", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function escapeHtmlAttr(input: string) {
  return escapeHtml(input).replaceAll("&#039;", "&apos;")
}
