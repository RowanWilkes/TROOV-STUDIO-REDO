import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createServiceRoleClient } from "@/lib/supabase-service"

const FEEDBACK_TO = "rowan.wilkes06@gmail.com"

export async function POST(request: Request) {
  console.log("[feedback] POST handler hit")
  let body: {
    message?: string
    priority?: string
    userId?: string | null
    userName?: string | null
    userEmail?: string | null
  }
  try {
    body = await request.json()
  } catch (e) {
    console.error("[feedback] Invalid JSON body", e)
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const message = typeof body.message === "string" ? body.message.trim() : ""
  const priority = typeof body.priority === "string" && ["low", "medium", "high"].includes(body.priority)
    ? body.priority
    : "medium"
  const userId = body.userId === undefined || body.userId === null ? null : String(body.userId).trim() || null
  const userName = body.userName === undefined || body.userName === null ? null : String(body.userName).trim() || null
  const userEmail = body.userEmail === undefined || body.userEmail === null ? null : String(body.userEmail).trim() || null

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 })
  }

  let supabase
  try {
    supabase = createServiceRoleClient()
  } catch (e) {
    console.error("[feedback] Supabase service role client failed", e)
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }

  const { error: insertError } = await supabase.from("feedback").insert({
    user_id: userId || null,
    message,
    priority,
  })

  if (insertError) {
    console.error("[feedback] Supabase insert failed:", {
      message: insertError.message,
      code: insertError.code,
      details: insertError.details,
      hint: insertError.hint,
    })
    return NextResponse.json(
      { error: "Failed to save feedback", details: insertError.message },
      { status: 500 }
    )
  }

  try {
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const resend = new Resend(resendKey)
      const from = "Troov Studio <onboarding@resend.dev>"
      await resend.emails.send({
        from,
        to: [FEEDBACK_TO],
        subject: `New Feedback [${priority.charAt(0).toUpperCase() + priority.slice(1)}] — Troov Studio`,
        html: [
          `<p><strong>Priority:</strong> ${priority}</p>`,
          `<p><strong>From:</strong> ${userName ?? userEmail ?? "—"}</p>`,
          userName && userEmail ? `<p><strong>Email:</strong> ${userEmail}</p>` : "",
          `<p><strong>User ID:</strong> ${userId ?? "—"}</p>`,
          `<p><strong>Time:</strong> ${new Date().toISOString()}</p>`,
          `<p><strong>Message:</strong></p>`,
          `<pre style="white-space:pre-wrap;">${message}</pre>`,
        ]
          .filter(Boolean)
          .join(""),
      })
    }
  } catch (emailErr) {
    console.error("[feedback] Resend email failed (feedback still saved):", emailErr)
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
