-- Enforce free plan limit: at most 1 project per user when plan = 'free'.
-- Assumes public.projects has user_id; public.user_subscriptions has user_id, plan.

CREATE OR REPLACE FUNCTION public.check_free_plan_project_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_plan text;
  project_count bigint;
BEGIN
  SELECT COALESCE(plan, 'free') INTO user_plan
  FROM public.user_subscriptions
  WHERE user_id = NEW.user_id;

  IF user_plan IS NULL THEN
    user_plan := 'free';
  END IF;

  IF user_plan <> 'free' THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO project_count
  FROM public.projects
  WHERE user_id = NEW.user_id;

  IF project_count >= 1 THEN
    RAISE EXCEPTION 'Free plan project limit reached';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_free_plan_project_limit ON public.projects;
CREATE TRIGGER enforce_free_plan_project_limit
  BEFORE INSERT ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.check_free_plan_project_limit();

-- Remediation: archive extra projects for a given user (run as superuser or with sufficient privileges).
-- First add column if needed: ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false;
-- Then archive all but the most recent:
-- UPDATE public.projects SET archived = true
-- WHERE user_id = '<user_id_here>'
-- AND id NOT IN (
--   SELECT id FROM public.projects WHERE user_id = '<user_id_here>' ORDER BY created_at DESC NULLS LAST LIMIT 1
-- );
-- If archived column does not exist, use DELETE instead (data loss):
-- DELETE FROM public.projects WHERE user_id = '<user_id_here>' AND id NOT IN (
--   SELECT id FROM public.projects WHERE user_id = '<user_id_here>' ORDER BY created_at DESC NULLS LAST LIMIT 1
-- );
