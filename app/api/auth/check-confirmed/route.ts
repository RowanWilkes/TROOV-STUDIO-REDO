import { createServiceRoleClient } from "@/lib/supabase-service"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ confirmed: false })

    const supabase = createServiceRoleClient()
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error || !users) return NextResponse.json({ confirmed: false })

    const user = users.find((u) => u.email === email)
    const confirmed = !!user?.email_confirmed_at

    return NextResponse.json({ confirmed })
  } catch {
    return NextResponse.json({ confirmed: false })
  }
}
