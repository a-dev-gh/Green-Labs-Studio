-- =============================================================================
-- Migration: 20260417_005_guest_cart_session_id.sql
-- Description: Unified guest + authenticated cart via session_id on cart_items.
--              Adds session_id column, relaxes user_id NOT NULL, enforces
--              exclusive ownership (user XOR session), rebuilds UNIQUE indexes,
--              replaces the quantity CHECK with quantity > 0 AND quantity <= 99,
--              and installs SECURITY DEFINER RPCs for anon-scoped access.
-- Risk: Medium | Confidence: High
-- Supersedes: the auth-only cart contract in Section 3.6 of the initial schema.
-- Architect spec: docs/architecture.md Section 11 "Guest Cart (Session-ID
--                 Unified Schema)". Oscar APPROVED design with quantity cap <= 99.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Schema changes to cart_items
-- ---------------------------------------------------------------------------

-- 1a. Allow guest rows: user_id becomes nullable.
ALTER TABLE public.cart_items
  ALTER COLUMN user_id DROP NOT NULL;

-- 1b. Add session_id for guest ownership.
ALTER TABLE public.cart_items
  ADD COLUMN IF NOT EXISTS session_id text;

-- 1c. Exclusive-ownership CHECK: exactly one of user_id / session_id is set.
ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_owner_check;

ALTER TABLE public.cart_items
  ADD CONSTRAINT cart_items_owner_check
  CHECK ((user_id IS NOT NULL) <> (session_id IS NOT NULL));

-- 1d. Session id shape validation (UUID v4 canonical form, case-insensitive).
ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_session_id_shape_check;

ALTER TABLE public.cart_items
  ADD CONSTRAINT cart_items_session_id_shape_check
  CHECK (
    session_id IS NULL
    OR session_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  );

-- 1e. Replace quantity CHECK to include the 99-cap (per Oscar).
--     Original auto-generated name in 20260408_001_initial_schema.sql is
--     cart_items_quantity_check.
ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_quantity_check;

ALTER TABLE public.cart_items
  ADD CONSTRAINT cart_items_quantity_check
  CHECK (quantity > 0 AND quantity <= 99);

-- 1f. Replace the old UNIQUE (user_id, product_id) with partial unique indexes
--     so the same product cannot be duplicated within a single owner, whether
--     that owner is a user or a guest session.
ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

DROP INDEX IF EXISTS public.cart_items_user_product_unique;
DROP INDEX IF EXISTS public.cart_items_session_product_unique;

CREATE UNIQUE INDEX cart_items_user_product_unique
  ON public.cart_items (user_id, product_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX cart_items_session_product_unique
  ON public.cart_items (session_id, product_id)
  WHERE session_id IS NOT NULL;

-- 1g. Index to speed guest-cart lookups by session_id.
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id
  ON public.cart_items (session_id)
  WHERE session_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 2. RLS posture
-- ---------------------------------------------------------------------------
-- RLS stays enabled. Existing authed policies (cart_items_*_own / _admin) from
-- 20260408_003_rls_policies.sql remain correct: auth.uid() = user_id naturally
-- excludes guest rows (where user_id IS NULL). Anonymous callers get no direct
-- DML; all guest access flows through the SECURITY DEFINER RPCs below.
-- Explicitly revoke any table privileges from anon so only RPCs work.
REVOKE ALL ON public.cart_items FROM anon;

-- ---------------------------------------------------------------------------
-- 3. Helper: session-id shape validation (keeps RPC bodies small)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.validate_session_id(p_session_id text)
RETURNS void
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF p_session_id IS NULL
     OR p_session_id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  THEN
    RAISE EXCEPTION 'invalid session id' USING ERRCODE = '22023';
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- 4. RPC suite (SECURITY DEFINER, scoped to the caller-supplied session_id)
-- ---------------------------------------------------------------------------

-- 4a. guest_cart_list: return the guest's cart rows joined with product fields
--     needed by CartProvider (kept flat to avoid leaking full product table).
DROP FUNCTION IF EXISTS public.guest_cart_list(text);
CREATE OR REPLACE FUNCTION public.guest_cart_list(p_session_id text)
RETURNS TABLE (
  id           uuid,
  session_id   text,
  product_id   uuid,
  quantity     integer,
  created_at   timestamptz,
  updated_at   timestamptz,
  product_name text,
  product_slug text,
  product_price numeric(10,2),
  product_images text[],
  product_stock  integer,
  product_is_active boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.validate_session_id(p_session_id);

  RETURN QUERY
    SELECT
      ci.id,
      ci.session_id,
      ci.product_id,
      ci.quantity,
      ci.created_at,
      ci.updated_at,
      p.name,
      p.slug,
      p.price,
      p.images,
      p.stock,
      p.is_active
    FROM public.cart_items ci
    JOIN public.products p ON p.id = ci.product_id
    WHERE ci.session_id = p_session_id
    ORDER BY ci.created_at ASC;
END;
$$;

-- 4b. guest_cart_add: upsert a guest row, combining quantities on conflict.
--     Quantity cap enforced here (Oscar) and by the CHECK constraint.
DROP FUNCTION IF EXISTS public.guest_cart_add(text, uuid, integer);
CREATE OR REPLACE FUNCTION public.guest_cart_add(
  p_session_id text,
  p_product_id uuid,
  p_quantity   integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing integer;
  v_new      integer;
BEGIN
  PERFORM public.validate_session_id(p_session_id);

  IF p_quantity IS NULL OR p_quantity <= 0 OR p_quantity > 99 THEN
    RAISE EXCEPTION 'invalid quantity' USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.products
    WHERE id = p_product_id AND is_active = true
  ) THEN
    RAISE EXCEPTION 'product not found or inactive' USING ERRCODE = '23503';
  END IF;

  SELECT quantity INTO v_existing
    FROM public.cart_items
   WHERE session_id = p_session_id
     AND product_id = p_product_id;

  IF v_existing IS NULL THEN
    INSERT INTO public.cart_items (session_id, product_id, quantity)
    VALUES (p_session_id, p_product_id, p_quantity);
  ELSE
    v_new := LEAST(v_existing + p_quantity, 99);
    UPDATE public.cart_items
       SET quantity = v_new
     WHERE session_id = p_session_id
       AND product_id = p_product_id;
  END IF;
END;
$$;

-- 4c. guest_cart_update_quantity: set an exact quantity for a guest cart row.
DROP FUNCTION IF EXISTS public.guest_cart_update_quantity(text, uuid, integer);
CREATE OR REPLACE FUNCTION public.guest_cart_update_quantity(
  p_session_id text,
  p_product_id uuid,
  p_quantity   integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.validate_session_id(p_session_id);

  IF p_quantity IS NULL OR p_quantity <= 0 OR p_quantity > 99 THEN
    RAISE EXCEPTION 'invalid quantity' USING ERRCODE = '22023';
  END IF;

  UPDATE public.cart_items
     SET quantity = p_quantity
   WHERE session_id = p_session_id
     AND product_id = p_product_id;
END;
$$;

-- 4d. guest_cart_remove: delete one product from a guest cart.
DROP FUNCTION IF EXISTS public.guest_cart_remove(text, uuid);
CREATE OR REPLACE FUNCTION public.guest_cart_remove(
  p_session_id text,
  p_product_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.validate_session_id(p_session_id);

  DELETE FROM public.cart_items
   WHERE session_id = p_session_id
     AND product_id = p_product_id;
END;
$$;

-- 4e. guest_cart_clear: delete every row for a session.
DROP FUNCTION IF EXISTS public.guest_cart_clear(text);
CREATE OR REPLACE FUNCTION public.guest_cart_clear(p_session_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.validate_session_id(p_session_id);

  DELETE FROM public.cart_items
   WHERE session_id = p_session_id;
END;
$$;

-- 4f. merge_guest_cart: authed-only; move guest rows into auth.uid(),
--     combining quantities on collision and capping at 99.
DROP FUNCTION IF EXISTS public.merge_guest_cart(text);
CREATE OR REPLACE FUNCTION public.merge_guest_cart(p_session_id text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid   uuid := auth.uid();
  v_count integer := 0;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'authentication required' USING ERRCODE = '28000';
  END IF;

  PERFORM public.validate_session_id(p_session_id);

  WITH moved AS (
    INSERT INTO public.cart_items (user_id, product_id, quantity)
    SELECT v_uid, g.product_id, g.quantity
      FROM public.cart_items g
     WHERE g.session_id = p_session_id
    ON CONFLICT (user_id, product_id)
      WHERE user_id IS NOT NULL
      DO UPDATE
        SET quantity = LEAST(public.cart_items.quantity + EXCLUDED.quantity, 99)
    RETURNING 1
  )
  SELECT count(*) INTO v_count FROM moved;

  DELETE FROM public.cart_items
   WHERE session_id = p_session_id;

  RETURN v_count;
END;
$$;

-- ---------------------------------------------------------------------------
-- 5. Grants: anon and authenticated may EXECUTE the guest RPCs; only
--    authenticated may EXECUTE merge_guest_cart.
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.guest_cart_list(text)                        FROM PUBLIC;
REVOKE ALL ON FUNCTION public.guest_cart_add(text, uuid, integer)          FROM PUBLIC;
REVOKE ALL ON FUNCTION public.guest_cart_update_quantity(text, uuid, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.guest_cart_remove(text, uuid)                FROM PUBLIC;
REVOKE ALL ON FUNCTION public.guest_cart_clear(text)                       FROM PUBLIC;
REVOKE ALL ON FUNCTION public.merge_guest_cart(text)                       FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.guest_cart_list(text)                        TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.guest_cart_add(text, uuid, integer)          TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.guest_cart_update_quantity(text, uuid, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.guest_cart_remove(text, uuid)                TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.guest_cart_clear(text)                       TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.merge_guest_cart(text)                       TO authenticated;

COMMIT;

-- =============================================================================
-- ROLLBACK SQL
-- Run the following in a single transaction to undo this migration.
-- Note: rolling back to a NOT NULL user_id will FAIL if guest rows exist; clear
-- them first (DELETE FROM public.cart_items WHERE session_id IS NOT NULL;).
-- =============================================================================
-- BEGIN;
--
-- -- Drop RPCs
-- DROP FUNCTION IF EXISTS public.merge_guest_cart(text);
-- DROP FUNCTION IF EXISTS public.guest_cart_clear(text);
-- DROP FUNCTION IF EXISTS public.guest_cart_remove(text, uuid);
-- DROP FUNCTION IF EXISTS public.guest_cart_update_quantity(text, uuid, integer);
-- DROP FUNCTION IF EXISTS public.guest_cart_add(text, uuid, integer);
-- DROP FUNCTION IF EXISTS public.guest_cart_list(text);
-- DROP FUNCTION IF EXISTS public.validate_session_id(text);
--
-- -- Drop indexes and constraints added by this migration
-- DROP INDEX IF EXISTS public.idx_cart_items_session_id;
-- DROP INDEX IF EXISTS public.cart_items_session_product_unique;
-- DROP INDEX IF EXISTS public.cart_items_user_product_unique;
--
-- ALTER TABLE public.cart_items
--   DROP CONSTRAINT IF EXISTS cart_items_session_id_shape_check;
-- ALTER TABLE public.cart_items
--   DROP CONSTRAINT IF EXISTS cart_items_owner_check;
--
-- -- Restore original quantity CHECK
-- ALTER TABLE public.cart_items
--   DROP CONSTRAINT IF EXISTS cart_items_quantity_check;
-- ALTER TABLE public.cart_items
--   ADD  CONSTRAINT cart_items_quantity_check CHECK (quantity > 0);
--
-- -- Restore original UNIQUE (user_id, product_id)
-- ALTER TABLE public.cart_items
--   ADD CONSTRAINT cart_items_user_id_product_id_key UNIQUE (user_id, product_id);
--
-- -- Drop session_id column and re-tighten user_id
-- ALTER TABLE public.cart_items DROP COLUMN IF EXISTS session_id;
-- DELETE FROM public.cart_items WHERE user_id IS NULL;
-- ALTER TABLE public.cart_items ALTER COLUMN user_id SET NOT NULL;
--
-- -- Restore anon privileges (none were granted originally; this is a no-op
-- -- kept for documentation)
-- -- REVOKE ALL ON public.cart_items FROM anon;  -- already revoked; RLS blocks anon
--
-- COMMIT;
