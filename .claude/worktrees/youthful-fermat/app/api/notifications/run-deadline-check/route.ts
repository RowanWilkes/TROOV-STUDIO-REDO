/**
 * Deadline notification job: creates one notification per project per milestone (7d, 3d, 1d, overdue).
 * Idempotent: uses deadline_notification_log so the same milestone is not sent twice.
 * Call daily via Vercel Cron or Supabase pg_cron (e.g. POST with Authorization: Bearer <cron-secret>).
 */
import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase-service"

function toUTCDate(ts: string): string {
  const d = new Date(ts)
  return d.toISOString().slice(0, 10)
}

function daysUntil(deadlineDate: string, today: string): number {
  const a = new Date(deadlineDate + "Z")
  const b = new Date(today + "Z")
  a.setUTCHours(0, 0, 0, 0)
  b.setUTCHours(0, 0, 0, 0)
  return Math.ceil((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24))
}

export async function POST() {
  try {
    const supabase = createServiceRoleClient()
    const today = toUTCDate(new Date().toISOString())

    const { data: projects, error: fetchError } = await supabase
      .from("projects")
      .select("id, user_id, title, deadline")
      .not("deadline", "is", null)

    if (fetchError) {
      console.error("[run-deadline-check] fetch projects error:", fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    let created = 0

    for (const project of projects ?? []) {
      const deadline = (project as { deadline?: string }).deadline
      if (!deadline) continue
      const deadlineDate = toUTCDate(deadline)
      const days = daysUntil(deadlineDate, today)

      const milestones: { milestone: string; title: string; body: string }[] = []
      if (days === 7) {
        milestones.push({
          milestone: "7d",
          title: "Deadline in 7 days",
          body: `${(project as { title?: string }).title ?? "Project"} is due in 7 days`,
        })
      }
      if (days === 3) {
        milestones.push({
          milestone: "3d",
          title: "Deadline in 3 days",
          body: `${(project as { title?: string }).title ?? "Project"} is due in 3 days`,
        })
      }
      if (days === 1) {
        milestones.push({
          milestone: "1d",
          title: "Deadline tomorrow",
          body: `${(project as { title?: string }).title ?? "Project"} is due tomorrow`,
        })
      }
      if (days < 0) {
        milestones.push({
          milestone: "overdue",
          title: "Deadline passed",
          body: `${(project as { title?: string }).title ?? "Project"} was due ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`,
        })
      }

      const userId = (project as { user_id: string }).user_id
      const projectId = (project as { id: string }).id

      for (const m of milestones) {
        const { error: logError } = await supabase.from("deadline_notification_log").insert({
          user_id: userId,
          project_id: projectId,
          milestone: m.milestone,
          deadline_date: deadlineDate,
        })

        if (logError) {
          if (logError.code === "23505") continue
          console.error("[run-deadline-check] log insert error:", logError)
          continue
        }

        const url = `/dashboard?project=${projectId}&view=overview`
        const { error: notifError } = await supabase.from("notifications").insert({
          user_id: userId,
          project_id: projectId,
          type: "deadline",
          title: m.title,
          body: m.body,
          url,
          is_read: false,
        })
        if (notifError) {
          console.error("[run-deadline-check] notification insert error:", notifError)
          continue
        }
        created++
      }
    }

    return NextResponse.json({ created })
  } catch (err) {
    console.error("[run-deadline-check] error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
