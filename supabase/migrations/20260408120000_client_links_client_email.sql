-- Optional client email on share links (feedback / resubmit notifications)
ALTER TABLE public.client_links
  ADD COLUMN IF NOT EXISTS client_email text;
