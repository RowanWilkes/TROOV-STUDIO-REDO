-- Subscription state per user (populated/updated by Stripe webhooks or checkout flow).
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text NOT NULL DEFAULT 'free',
  status text,
  current_period_end timestamptz,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_subscriptions_select_own"
  ON public.user_subscriptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "user_subscriptions_update_own"
  ON public.user_subscriptions FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_subscriptions_insert_own"
  ON public.user_subscriptions FOR INSERT
  WITH CHECK (user_id = auth.uid());
