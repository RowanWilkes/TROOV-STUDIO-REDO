import { NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"
import { createServiceRoleClient } from "@/lib/supabase-service"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature") ?? ""

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    const supabase = createServiceRoleClient()

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? ""
        const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? ""

        if (!customerId || !subscriptionId) {
          console.error("[stripe webhook] checkout.session.completed missing customer or subscription", {
            customerId,
            subscriptionId,
          })
          break
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        const { error: updateError } = await supabase
          .from("user_subscriptions")
          .update({
            stripe_subscription_id: subscriptionId,
            plan: "pro",
            status: "active",
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId)

        if (updateError) {
          console.error("[stripe webhook] checkout.session.completed update failed", updateError)
          break
        }

        // Send confirmation email
        const { data: subRow } = await supabase
          .from("user_subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .maybeSingle()

        const userId = subRow?.user_id
        if (userId && process.env.RESEND_API_KEY) {
          const { data: authUser } = await supabase.auth.admin.getUserById(userId)
          const userEmail = authUser?.user?.email
          if (userEmail) {
            const resend = new Resend(process.env.RESEND_API_KEY)
            await resend.emails.send({
              from: "Troov Studio <contact@troov-marketing.com>",
              to: userEmail,
              subject: "Welcome to Troov Studio Pro!",
              html: `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
      <h1 style="font-size:20px;font-weight:700;color:#111827;">You're now on Troov Studio Pro!</h1>
      <p style="color:#6b7280;font-size:15px;line-height:1.6;">
        Thank you for upgrading. You now have access to unlimited projects and all Pro features.
      </p>
      <p style="color:#6b7280;font-size:15px;">
        <a href="https://troovstudio.com/dashboard" style="color:#059669;font-weight:600;">Go to your dashboard →</a>
      </p>
      <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0;">
      <p style="color:#d1d5db;font-size:12px;">Troov Studio · troovstudio.com</p>
    </div>
  `,
            }).catch((err) => console.error("[stripe webhook] Resend email failed", err))
          }
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id ?? ""
      const { status } = subscription

      let plan: string
      let mappedStatus: string
      if (status === "active" || status === "trialing") {
        plan = "pro"
        mappedStatus = "active"
      } else if (status === "past_due") {
        plan = "pro"
        mappedStatus = "past_due"
      } else {
        plan = "free"
        mappedStatus = status
      }

      await supabase
        .from("user_subscriptions")
        .update({
          plan,
          status: mappedStatus,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId)
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      await supabase
        .from("user_subscriptions")
        .update({
          plan: "free",
          status: "canceled",
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId)
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      await supabase
        .from("user_subscriptions")
        .update({ status: "past_due", updated_at: new Date().toISOString() })
        .eq("stripe_customer_id", customerId)
      break
    }
  }
  } catch (err) {
    console.error("[stripe webhook] Unhandled webhook error", err)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
