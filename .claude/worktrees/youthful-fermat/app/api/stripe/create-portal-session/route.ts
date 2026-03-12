import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { session: authSession },
  } = await supabase.auth.getSession()

  if (!authSession?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 },
    )
  }

  const { data: subscription, error: subError } = await supabase
    .from("user_subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", authSession.user.id)
    .maybeSingle()

  if (subError || !subscription?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No billing account found. Upgrade to a paid plan first." },
      { status: 400 },
    )
  }

  const origin =
    request.headers.get("origin") ||
    request.headers.get("referer")?.split("/").slice(0, 3).join("/") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  const returnUrl = `${origin.replace(/\/$/, "")}/dashboard`

  const stripe = new Stripe(stripeSecretKey)
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: returnUrl,
  })

  return NextResponse.json({ url: portalSession.url })
}
