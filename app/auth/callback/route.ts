import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type")

  // Detect if the request is coming from a mobile device
  const userAgent = request.headers.get("user-agent") || ""
  const isMobile = /android|iphone|ipad|ipod|mobile/i.test(userAgent)

  let confirmationSuccess = false

  // Handle PKCE flow (code parameter)
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) confirmationSuccess = true
  }

  // Handle token hash flow (email confirmation links)
  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "email" | "recovery" | "invite" | "email_change",
    })
    if (!error) confirmationSuccess = true
  }

  if (confirmationSuccess) {
    if (isMobile) {
      // On mobile: show a page telling them to go back to their desktop
      return NextResponse.redirect(`${origin}/auth/confirmed?device=mobile`)
    } else {
      // On desktop: go straight to dashboard
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // If confirmation failed
  return NextResponse.redirect(`${origin}/login?error=Could not confirm your email. Please try again.`)
}
