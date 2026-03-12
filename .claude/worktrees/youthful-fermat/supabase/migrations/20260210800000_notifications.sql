-- In-app notifications and deadline idempotency log.
-- Requires public.projects and auth.users.

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  url text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_created_idx ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_user_read_idx ON public.notifications (user_id, is_read);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_delete_own" ON public.notifications;
CREATE POLICY "notifications_delete_own" ON public.notifications FOR DELETE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_insert_own" ON public.notifications;
CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT WITH CHECK (user_id = auth.uid());

-- Idempotency: one notification per (user, project, milestone, deadline_date).
CREATE TABLE IF NOT EXISTS public.deadline_notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL,
  milestone text NOT NULL,
  deadline_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, project_id, milestone, deadline_date)
);

ALTER TABLE public.deadline_notification_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deadline_log_select_own" ON public.deadline_notification_log;
CREATE POLICY "deadline_log_select_own" ON public.deadline_notification_log FOR SELECT USING (user_id = auth.uid());

-- INSERT is done by service role (bypasses RLS). No policy needed for insert from API.

-- Optional: project_members for future team notifications.
CREATE TABLE IF NOT EXISTS public.project_members (
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, user_id)
);

ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "project_members_select_own" ON public.project_members;
CREATE POLICY "project_members_select_own" ON public.project_members FOR SELECT USING (user_id = auth.uid());
