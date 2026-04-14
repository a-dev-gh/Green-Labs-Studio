-- Migration: Add user_id and status to testimonials
-- Allows registered users to submit testimonials pending admin approval

-- Add status column (pending → approved → rejected)
ALTER TABLE testimonials
  ADD COLUMN status text NOT NULL DEFAULT 'approved'
    CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add user_id FK (nullable — admin-created testimonials have no user)
ALTER TABLE testimonials
  ADD COLUMN user_id uuid REFERENCES profiles(id) ON DELETE SET NULL;

-- Index for filtering by status in admin dashboard
CREATE INDEX idx_testimonials_status ON testimonials (status);

-- Update RLS: allow authenticated users to INSERT their own testimonials
CREATE POLICY "Users can submit testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending'
  );

-- Allow users to read their own pending testimonials
CREATE POLICY "Users can view own testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ROLLBACK:
-- DROP POLICY IF EXISTS "Users can submit testimonials" ON testimonials;
-- DROP POLICY IF EXISTS "Users can view own testimonials" ON testimonials;
-- DROP INDEX IF EXISTS idx_testimonials_status;
-- ALTER TABLE testimonials DROP COLUMN IF EXISTS user_id;
-- ALTER TABLE testimonials DROP COLUMN IF EXISTS status;
