-- Dashboard section tables: one row per project or many rows per project.
-- Requires public.projects (id uuid) and auth.users to exist.

-- mood_board: one row per project (style notes)
CREATE TABLE IF NOT EXISTS public.mood_board (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL UNIQUE REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  style_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.mood_board ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_mood_board" ON public.mood_board FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- mood_board_items: many rows per project (images + website refs)
CREATE TABLE IF NOT EXISTS public.mood_board_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  url text,
  title text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.mood_board_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_mood_board_items" ON public.mood_board_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- style_guide: one row per project (jsonb)
CREATE TABLE IF NOT EXISTS public.style_guide (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL UNIQUE REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.style_guide ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_style_guide" ON public.style_guide FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- sitemap: one row per project (pages + custom_blocks jsonb)
CREATE TABLE IF NOT EXISTS public.sitemap (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL UNIQUE REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pages jsonb DEFAULT '[]',
  custom_blocks jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.sitemap ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_sitemap" ON public.sitemap FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- technical_specs: one row per project (flat columns)
CREATE TABLE IF NOT EXISTS public.technical_specs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL UNIQUE REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_hosting text,
  hosting_notes text,
  proposed_hosting text,
  cms text,
  content_update_frequency text,
  content_managers text,
  editable_content text,
  third_party_integrations text,
  technical_requirements text,
  performance_requirements text,
  browser_support text,
  seo_requirements text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.technical_specs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_technical_specs" ON public.technical_specs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- content_section: one row per project (jsonb)
CREATE TABLE IF NOT EXISTS public.content_section (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL UNIQUE REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.content_section ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_content_section" ON public.content_section FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- asset_section: one row per project (jsonb)
CREATE TABLE IF NOT EXISTS public.asset_section (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL UNIQUE REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.asset_section ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_asset_section" ON public.asset_section FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- tasks: many rows per project
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  completed boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
