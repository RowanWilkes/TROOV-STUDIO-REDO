-- Client Content Link feature: client_links and client_submissions tables.
-- Requires public.projects and auth.users.

-- client_links: per-project shareable links for client content submission
CREATE TABLE IF NOT EXISTS public.client_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz
);

CREATE INDEX IF NOT EXISTS client_links_token_idx ON public.client_links (token);
CREATE INDEX IF NOT EXISTS client_links_project_idx ON public.client_links (project_id);

ALTER TABLE public.client_links ENABLE ROW LEVEL SECURITY;

-- Project owner can manage their links (authenticated)
DROP POLICY IF EXISTS "client_links_owner" ON public.client_links;
CREATE POLICY "client_links_owner" ON public.client_links
  FOR ALL
  USING (
    project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
  )
  WITH CHECK (
    project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
  );

-- client_submissions: one row per submitted field value
CREATE TABLE IF NOT EXISTS public.client_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_link_id uuid NOT NULL REFERENCES public.client_links(id) ON DELETE CASCADE,
  project_id uuid NOT NULL,
  field_key text NOT NULL,
  field_label text NOT NULL,
  field_type text NOT NULL,   -- "text", "longtext", "file"
  text_value text,
  file_url text,
  page_name text,
  section_name text,
  is_blank boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',  -- "pending", "accepted", "rejected"
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS client_submissions_link_idx ON public.client_submissions (client_link_id);
CREATE INDEX IF NOT EXISTS client_submissions_project_idx ON public.client_submissions (project_id);

ALTER TABLE public.client_submissions ENABLE ROW LEVEL SECURITY;

-- Project owner can manage their submissions (authenticated)
DROP POLICY IF EXISTS "client_submissions_owner" ON public.client_submissions;
CREATE POLICY "client_submissions_owner" ON public.client_submissions
  FOR ALL
  USING (
    project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
  )
  WITH CHECK (
    project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
  );

-- Storage bucket for client file uploads (public read, service-role write)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'client-uploads',
  'client-uploads',
  true,
  10485760,
  ARRAY['image/png','image/jpeg','image/jpg','image/gif','image/webp','image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Public read policy for client-uploads bucket
DROP POLICY IF EXISTS "client_uploads_public_read" ON storage.objects;
CREATE POLICY "client_uploads_public_read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'client-uploads');
-- Writes are performed via the service role key in API routes (bypasses RLS)
