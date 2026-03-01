CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'system',
  compact_mode boolean NOT NULL DEFAULT false,
  show_animations boolean NOT NULL DEFAULT true,
  email_notifications boolean NOT NULL DEFAULT true,
  task_reminders boolean NOT NULL DEFAULT true,
  weekly_summary boolean NOT NULL DEFAULT false,
  auto_save boolean NOT NULL DEFAULT true,
  collapse_sidebar boolean NOT NULL DEFAULT false,
  default_project_view text DEFAULT 'home',
  updated_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.set_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_user_preferences_updated_at();

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_preferences_select_own"
  ON public.user_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "user_preferences_insert_own"
  ON public.user_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_preferences_update_own"
  ON public.user_preferences FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
