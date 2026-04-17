-- =============================================================================
-- Migration: 20260417_006_storage_bucket.sql
-- Description: Creates the `greenlabs-images` public storage bucket and the
--              RLS policies governing read/write access on storage.objects
--              for that bucket. Writes are restricted to admins via the
--              existing `public.is_admin()` helper (defined in
--              20260408_003_rls_policies.sql).
--
-- Source spec: docs/architecture.md Section 12 (Image Storage — greenlabs-images Bucket)
-- Depends on: 20260408_003_rls_policies.sql (public.is_admin())
--
-- Risk: Low | Confidence: High
-- Human approval: APPROVED by Oscar (2026-04-17)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Create the public bucket
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('greenlabs-images', 'greenlabs-images', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 2. RLS policies on storage.objects scoped to the greenlabs-images bucket
--    - Public SELECT (anon + authed): read any object in this bucket
--    - Admin-only INSERT / UPDATE / DELETE via public.is_admin()
-- ---------------------------------------------------------------------------

create policy "greenlabs_images_public_read"
  on storage.objects for select
  using (bucket_id = 'greenlabs-images');

create policy "greenlabs_images_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'greenlabs-images' and public.is_admin());

create policy "greenlabs_images_admin_update"
  on storage.objects for update
  using (bucket_id = 'greenlabs-images' and public.is_admin());

create policy "greenlabs_images_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'greenlabs-images' and public.is_admin());

-- =============================================================================
-- ROLLBACK SQL
-- Run these statements to undo this migration. Deleting the bucket will
-- cascade-remove all uploaded objects — use with care.
-- =============================================================================
-- DROP POLICY IF EXISTS "greenlabs_images_admin_delete" ON storage.objects;
-- DROP POLICY IF EXISTS "greenlabs_images_admin_update" ON storage.objects;
-- DROP POLICY IF EXISTS "greenlabs_images_admin_insert" ON storage.objects;
-- DROP POLICY IF EXISTS "greenlabs_images_public_read"  ON storage.objects;
-- DELETE FROM storage.buckets WHERE id = 'greenlabs-images';
