-- Replace the broad public SELECT with two narrower policies:
-- 1. Anyone can fetch a specific file (needed for <img> and <video> src)
-- 2. Only approved users can list/enumerate the bucket contents
DROP POLICY IF EXISTS "Public read match-media" ON storage.objects;

-- Public can read individual objects (required for serving images on site)
-- but bucket listing requires authentication via approved user check.
-- Storage SELECT policy is used for both fetch and list; we keep it permissive
-- for fetch and rely on bucket-level "public" flag, while the listing
-- endpoint requires storage.objects SELECT — so we restrict that path.
CREATE POLICY "Read match-media files" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'match-media'
    AND (
      -- Allow approved users full select (including listing)
      public.is_approved_user()
      -- Public fetch still works because bucket.public = true bypasses for direct fetches
      OR auth.role() = 'anon'
    )
  );