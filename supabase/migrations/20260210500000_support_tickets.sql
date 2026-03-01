CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "support_tickets_select_own"
  ON public.support_tickets FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "support_tickets_insert_own"
  ON public.support_tickets FOR INSERT
  WITH CHECK (user_id = auth.uid());
