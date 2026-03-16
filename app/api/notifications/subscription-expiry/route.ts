import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase-service"

export async function POST(request: Request) {
  const supabase = createServiceRoleClient()

  // Find subscriptions expiring in the next 7 days that are cancelling
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
  const oneDayFromNow = new Date()
  oneDayFromNow.setDate(oneDayFromNow.getDate() + 1)

  // 7 day warning
  const { data: expiringSoon } = await supabase
    .from("user_subscriptions")
    .select("user_id, current_period_end")
    .eq("status", "cancelling")
    .gte("current_period_end", new Date().toISOString())
    .lte("current_period_end", sevenDaysFromNow.toISOString())

  for (const sub of expiringSoon ?? []) {
    const formattedDate = new Date(sub.current_period_end).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    // Check if we already sent this notification recently to avoid duplicates
    const { data: existing } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", sub.user_id)
      .eq("type", "subscription_expiring_soon")
      .gte("created_at", new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString())
      .maybeSingle()

    if (!existing) {
      await supabase.from("notifications").insert({
        user_id: sub.user_id,
        project_id: null,
        type: "subscription_expiring_soon",
        title: "⏰ Pro access ending soon",
        body: `Your Troov Studio Pro access ends on ${formattedDate}. Resubscribe to keep unlimited projects and Pro features.`,
        url: "/dashboard",
        is_read: false,
      })
    }
  }

  return NextResponse.json({ ok: true, processed: expiringSoon?.length ?? 0 })
}
