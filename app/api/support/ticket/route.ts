import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { session: authSession },
  } = await supabase.auth.getSession()

  if (!authSession?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { subject?: string; message?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Subject and message are required" },
      { status: 400 },
    )
  }

  const subject = typeof body.subject === "string" ? body.subject.trim() : ""
  const message = typeof body.message === "string" ? body.message.trim() : ""

  if (!subject || !message) {
    return NextResponse.json(
      { error: "Subject and message are required" },
      { status: 400 },
    )
  }

  const { data: row, error: insertError } = await supabase
    .from("support_tickets")
    .insert({
      user_id: authSession.user.id,
      email: authSession.user.email ?? null,
      subject,
      message,
    })
    .select("id")
    .single()

  if (insertError) {
    console.error("[support/ticket] insert error:", insertError)
    return NextResponse.json(
      { error: "Failed to create support ticket" },
      { status: 500 },
    )
  }

  const ticketId = row?.id
  const resendKey = process.env.RESEND_API_KEY
  const supportInbox = process.env.SUPPORT_INBOX_EMAIL
  if (resendKey && supportInbox) {
    try {
      const resend = new Resend(resendKey)
      const from =
        process.env.SUPPORT_FROM_EMAIL ?? "Troov Studio <onboarding@resend.dev>"
      await resend.emails.send({
        from,
        to: [supportInbox],
        subject: `[Support] ${subject}`,
        html: [
          `<p><strong>Ticket ID:</strong> ${ticketId}</p>`,
          `<p><strong>From:</strong> ${authSession.user.email ?? "—"}</p>`,
          `<p><strong>Subject:</strong> ${subject}</p>`,
          `<p><strong>Message:</strong></p>`,
          `<pre style="white-space:pre-wrap;">${message}</pre>`,
        ].join(""),
      })
    } catch (emailErr) {
      console.error("[support/ticket] email send error:", emailErr)
    }
  }

  return NextResponse.json({ ok: true, ticketId })
}
