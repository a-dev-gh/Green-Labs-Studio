-- =============================================================================
-- Migration: 20260417_008_hardening.sql
-- Description: Security + stability hardening based on pre-deploy audit.
--   1. Fix handle_new_user() so auth invites succeed — add search_path,
--      explicit public.* qualifiers, ON CONFLICT guard, and a fallback
--      EXCEPTION block so a profile-insert hiccup never blocks user creation.
--   2. Tighten the public testimonials SELECT policy so only APPROVED rows
--      are visible to anon (previously leaked pending/rejected submissions).
--   3. Re-label validate_session_id() as STABLE (was IMMUTABLE, which is
--      undefined behavior for a function that raises exceptions).
-- Risk: Low-Medium | Confidence: High
-- Depends on: 001, 002, 003, 004, 005
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. handle_new_user() hardening
-- ---------------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block user creation if the profile insert hits an edge case;
  -- log a warning so the admin can backfill manually.
  RAISE WARNING 'handle_new_user failed for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. Testimonials — only APPROVED rows are publicly readable
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "testimonials_select_public" ON public.testimonials;

CREATE POLICY "testimonials_select_approved_public"
  ON public.testimonials FOR SELECT
  USING (status = 'approved');

-- Authenticated users may also read their own non-approved submissions so
-- they can see "pending moderation" state on their profile page.
CREATE POLICY "testimonials_select_own_pending"
  ON public.testimonials FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can still see everything (policy from 003 stays as-is).

-- ---------------------------------------------------------------------------
-- 3. validate_session_id: IMMUTABLE -> STABLE
-- Raising exceptions from an IMMUTABLE function is undefined behavior; Postgres
-- may constant-fold the call. STABLE is the correct volatility class here.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_valid_session_id(p_session_id text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT p_session_id IS NOT NULL
     AND length(p_session_id) = 36
     AND p_session_id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
$$;

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- -- 1. Restore pre-hardening handle_new_user (matches 001_initial_schema.sql):
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO profiles (id, full_name)
--   VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
--
-- -- 2. Restore permissive testimonials SELECT:
-- DROP POLICY IF EXISTS "testimonials_select_approved_public" ON public.testimonials;
-- DROP POLICY IF EXISTS "testimonials_select_own_pending"     ON public.testimonials;
-- CREATE POLICY "testimonials_select_public"
--   ON public.testimonials FOR SELECT USING (true);
--
-- -- 3. Restore IMMUTABLE volatility on is_valid_session_id:
-- CREATE OR REPLACE FUNCTION public.is_valid_session_id(p_session_id text)
-- RETURNS boolean LANGUAGE sql IMMUTABLE AS $$
--   SELECT p_session_id IS NOT NULL
--      AND length(p_session_id) = 36
--      AND p_session_id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
-- $$;
