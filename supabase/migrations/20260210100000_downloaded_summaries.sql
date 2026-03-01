-- Downloaded summaries: table + RLS.
-- Storage bucket "summaries" must exist (create in Dashboard if needed); policies below assume path prefix auth.uid()/.

-- Table: one row per downloaded summary (file stored in Supabase Storage).
CREATE TABLE IF NOT EXISTS public.downloaded_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  is_client_copy boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_downloaded_summaries_user_created
  ON public.downloaded_summaries (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_downloaded_summaries_project_created
  ON public.downloaded_summaries (project_id, created_at DESC);

ALTER TABLE public.downloaded_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_select_downloaded_summaries"
  ON public.downloaded_summaries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_insert_downloaded_summaries"
  ON public.downloaded_summaries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_delete_downloaded_summaries"
  ON public.downloaded_summaries FOR DELETE
  USING (auth.uid() = user_id);

-- Storage: create bucket "summaries" (private).
-- If this fails (e.g. no storage.buckets in your project), create the bucket in Supabase Dashboard: Storage -> New bucket -> name "summaries", private.
INSERT INTO storage.buckets (id, name, public)
VALUES ('summaries', 'summaries', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- RLS on storage.objects: users can only access objects under their own folder (path prefix auth.uid()/).
-- name format: userId/projectId/timestamp-slug.pdf so first path segment = user id.

CREATE POLICY "summaries_insert_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'summaries'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "summaries_select_own"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'summaries'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "summaries_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'summaries'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
