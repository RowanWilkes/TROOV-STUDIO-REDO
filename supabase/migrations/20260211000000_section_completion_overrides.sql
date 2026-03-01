-- Store user "Mark as Complete" overrides per project/section.
-- Completion = override (if true) else content-based.
CREATE TABLE IF NOT EXISTS public.section_completion_overrides (
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  section text NOT NULL,
  is_complete boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, section),
  CONSTRAINT section_completion_overrides_section_check CHECK (section IN (
    'overview', 'mood', 'styleguide', 'wireframe', 'technical', 'content', 'assets', 'tasks'
  ))
);

CREATE OR REPLACE FUNCTION public.set_section_completion_overrides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS section_completion_overrides_updated_at ON public.section_completion_overrides;
CREATE TRIGGER section_completion_overrides_updated_at
  BEFORE UPDATE ON public.section_completion_overrides
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_section_completion_overrides_updated_at();

ALTER TABLE public.section_completion_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "section_completion_overrides_select_own" ON public.section_completion_overrides;
CREATE POLICY "section_completion_overrides_select_own"
  ON public.section_completion_overrides FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "section_completion_overrides_insert_own" ON public.section_completion_overrides;
CREATE POLICY "section_completion_overrides_insert_own"
  ON public.section_completion_overrides FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "section_completion_overrides_update_own" ON public.section_completion_overrides;
CREATE POLICY "section_completion_overrides_update_own"
  ON public.section_completion_overrides FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid())
  );
