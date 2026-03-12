// Required env vars: STRIPE_SECRET_KEY, STRIPE_PRO_PRICE_ID (monthly), STRIPE_PRO_YEARLY_PRICE_ID (yearly), NEXT_PUBLIC_APP_URL
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase-server"
import { createServiceRoleClient } from "@/lib/supabase-service"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const billingPeriod = body.billingPeriod === "yearly" ? "yearly" : "monthly"
  const priceId =
    billingPeriod === "yearly"
      ? process.env.STRIPE_PRO_YEARLY_PRICE_ID
      : process.env.STRIPE_PRO_PRICE_ID

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const serviceClient = createServiceRoleClient()

  const { data: existingSub } = await serviceClient
    .from("user_subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle()

  let stripeCustomerId = existingSub?.stripe_customer_id as string | undefined

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })
    stripeCustomerId = customer.id

    await serviceClient.from("user_subscriptions").upsert(
      { user_id: user.id, stripe_customer_id: stripeCustomerId, plan: "free" },
      { onConflict: "user_id" },
    )
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    line_items: [{ price: priceId!, quantity: 1 }],
    success_url: process.env.NEXT_PUBLIC_APP_URL + "/dashboard?upgraded=true",
    cancel_url: process.env.NEXT_PUBLIC_APP_URL + "/pricing",
    metadata: { supabase_user_id: user.id },
  })

  return NextResponse.json({ url: session.url })
}
