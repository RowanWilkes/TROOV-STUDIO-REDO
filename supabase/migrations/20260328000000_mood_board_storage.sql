INSERT INTO storage.buckets (id, name, public)
VALUES ('mood-board-images', 'mood-board-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- INSERT: authenticated users can upload to paths starting with their own user ID
DROP POLICY IF EXISTS "mood_board_images_insert_own" ON storage.objects;
CREATE POLICY "mood_board_images_insert_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'mood-board-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- SELECT: public read (bucket is public)
DROP POLICY IF EXISTS "mood_board_images_select_public" ON storage.objects;
CREATE POLICY "mood_board_images_select_public"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'mood-board-images');

-- DELETE: authenticated users can delete their own files
DROP POLICY IF EXISTS "mood_board_images_delete_own" ON storage.objects;
CREATE POLICY "mood_board_images_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'mood-board-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
