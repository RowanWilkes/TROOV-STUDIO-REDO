import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/stripe/webhook") {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options ?? {})
          })
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If the user is logged in but email is not confirmed, keep them on the signup flow
  if (user && !user.email_confirmed_at) {
    const url = request.nextUrl.clone()
    if (!url.pathname.startsWith("/signup")) {
      url.pathname = "/signup"
      url.searchParams.set("confirm", "pending")
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  // Exclude: _next/static, _next/image, favicon.ico, /api/*, /auth/* (auth callbacks)
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|api$|auth/|auth$).*)"],
}
