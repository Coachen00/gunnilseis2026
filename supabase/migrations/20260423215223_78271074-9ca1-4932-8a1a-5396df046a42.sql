-- 1. Make match-media bucket private
UPDATE storage.buckets SET public = false WHERE id = 'match-media';

-- 2. Replace permissive SELECT policy with approved-user-only
DROP POLICY IF EXISTS "Read match-media files" ON storage.objects;
CREATE POLICY "Approved users read match-media"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'match-media'
  AND public.is_approved_user()
);

-- 3. Add INSERT policy on profiles so users can create their own row
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);