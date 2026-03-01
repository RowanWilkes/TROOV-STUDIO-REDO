-- Notify other project members when a section is updated.
-- Uses project_members if present; else notifies project owner (if different from actor).

CREATE OR REPLACE FUNCTION public.notify_project_activity(
  p_project_id uuid,
  p_actor_id uuid,
  p_section_display_name text,
  p_section_view text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_recipient_id uuid;
  v_actor_name text;
  v_project_title text;
  v_body text;
  v_url text;
BEGIN
  -- Actor display name from profiles
  SELECT COALESCE(NULLIF(trim(full_name), ''), 'A team member')
  INTO v_actor_name
  FROM public.profiles
  WHERE user_id = p_actor_id
  LIMIT 1;
  IF v_actor_name IS NULL THEN
    v_actor_name := 'A team member';
  END IF;

  -- Project title for body (optional)
  SELECT title INTO v_project_title FROM public.projects WHERE id = p_project_id LIMIT 1;
  v_project_title := COALESCE(NULLIF(trim(v_project_title), ''), 'Project');

  v_body := v_actor_name || ' updated ' || p_section_display_name || ' in ' || v_project_title;
  v_url := '/dashboard?project=' || p_project_id || '&view=' || COALESCE(p_section_view, 'overview');

  -- Recipients: project_members for this project except actor, or else project owner if different from actor
  FOR v_recipient_id IN
    SELECT pm.user_id
    FROM public.project_members pm
    WHERE pm.project_id = p_project_id
      AND pm.user_id != p_actor_id
    UNION
    SELECT p.user_id
    FROM public.projects p
    WHERE p.id = p_project_id
      AND p.user_id != p_actor_id
      AND NOT EXISTS (
        SELECT 1 FROM public.project_members pm2
        WHERE pm2.project_id = p_project_id
      )
  LOOP
    INSERT INTO public.notifications (user_id, project_id, type, title, body, url, is_read)
    VALUES (v_recipient_id, p_project_id, 'activity', 'Project updated', v_body, v_url, false);
  END LOOP;
END;
$$;

-- Trigger helpers: fire only when updated_at changed (avoids no-op saves).
CREATE OR REPLACE FUNCTION public.trigger_notify_mood_board()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.updated_at IS DISTINCT FROM NEW.updated_at THEN
    PERFORM public.notify_project_activity(NEW.project_id, NEW.user_id, 'Mood Board', 'moodboard');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_notify_style_guide()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.updated_at IS DISTINCT FROM NEW.updated_at THEN
    PERFORM public.notify_project_activity(NEW.project_id, NEW.user_id, 'Style Guide', 'styleguide');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_notify_sitemap()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.updated_at IS DISTINCT FROM NEW.updated_at THEN
    PERFORM public.notify_project_activity(NEW.project_id, NEW.user_id, 'Sitemap', 'sitemap');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_notify_technical_specs()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.updated_at IS DISTINCT FROM NEW.updated_at THEN
    PERFORM public.notify_project_activity(NEW.project_id, NEW.user_id, 'Technical Specs', 'technical');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_notify_content_section()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.updated_at IS DISTINCT FROM NEW.updated_at THEN
    PERFORM public.notify_project_activity(NEW.project_id, NEW.user_id, 'Content', 'content');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_notify_asset_section()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.updated_at IS DISTINCT FROM NEW.updated_at THEN
    PERFORM public.notify_project_activity(NEW.project_id, NEW.user_id, 'Assets', 'assets');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_activity_mood_board ON public.mood_board;
CREATE TRIGGER notify_activity_mood_board AFTER UPDATE ON public.mood_board
  FOR EACH ROW EXECUTE FUNCTION public.trigger_notify_mood_board();

DROP TRIGGER IF EXISTS notify_activity_style_guide ON public.style_guide;
CREATE TRIGGER notify_activity_style_guide AFTER UPDATE ON public.style_guide
  FOR EACH ROW EXECUTE FUNCTION public.trigger_notify_style_guide();

DROP TRIGGER IF EXISTS notify_activity_sitemap ON public.sitemap;
CREATE TRIGGER notify_activity_sitemap AFTER UPDATE ON public.sitemap
  FOR EACH ROW EXECUTE FUNCTION public.trigger_notify_sitemap();

DROP TRIGGER IF EXISTS notify_activity_technical_specs ON public.technical_specs;
CREATE TRIGGER notify_activity_technical_specs AFTER UPDATE ON public.technical_specs
  FOR EACH ROW EXECUTE FUNCTION public.trigger_notify_technical_specs();

DROP TRIGGER IF EXISTS notify_activity_content_section ON public.content_section;
CREATE TRIGGER notify_activity_content_section AFTER UPDATE ON public.content_section
  FOR EACH ROW EXECUTE FUNCTION public.trigger_notify_content_section();

DROP TRIGGER IF EXISTS notify_activity_asset_section ON public.asset_section;
CREATE TRIGGER notify_activity_asset_section AFTER UPDATE ON public.asset_section
  FOR EACH ROW EXECUTE FUNCTION public.trigger_notify_asset_section();
