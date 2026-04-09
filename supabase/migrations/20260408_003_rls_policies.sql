-- =============================================================================
-- GREENLABS.Studio — RLS Policies Migration
-- Migration: 20260408_003_rls_policies
-- Risk: Low | Confidence: High
-- =============================================================================
-- This migration enables Row Level Security on all tables and creates
-- fine-grained access policies per Section 4.4 of architecture.md.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Helper: is_admin() — reusable check against profiles.role
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- =============================================================================
-- 1. PUBLIC TABLES — SELECT for everyone, INSERT/UPDATE/DELETE for admin only
-- Tables: products, categories, services, souvenir_packages, testimonials,
--         cms_content, proposals
-- =============================================================================

-- ---- products ---------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_public"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "products_insert_admin"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "products_update_admin"
  ON public.products FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "products_delete_admin"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- ---- categories -------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_public"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "categories_insert_admin"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "categories_update_admin"
  ON public.categories FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "categories_delete_admin"
  ON public.categories FOR DELETE
  USING (public.is_admin());

-- ---- services ---------------------------------------------------------------
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "services_select_public"
  ON public.services FOR SELECT
  USING (true);

CREATE POLICY "services_insert_admin"
  ON public.services FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "services_update_admin"
  ON public.services FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "services_delete_admin"
  ON public.services FOR DELETE
  USING (public.is_admin());

-- ---- souvenir_packages ------------------------------------------------------
ALTER TABLE public.souvenir_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "souvenir_packages_select_public"
  ON public.souvenir_packages FOR SELECT
  USING (true);

CREATE POLICY "souvenir_packages_insert_admin"
  ON public.souvenir_packages FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "souvenir_packages_update_admin"
  ON public.souvenir_packages FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "souvenir_packages_delete_admin"
  ON public.souvenir_packages FOR DELETE
  USING (public.is_admin());

-- ---- testimonials -----------------------------------------------------------
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "testimonials_select_public"
  ON public.testimonials FOR SELECT
  USING (true);

CREATE POLICY "testimonials_insert_admin"
  ON public.testimonials FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "testimonials_update_admin"
  ON public.testimonials FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "testimonials_delete_admin"
  ON public.testimonials FOR DELETE
  USING (public.is_admin());

-- ---- cms_content ------------------------------------------------------------
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cms_content_select_public"
  ON public.cms_content FOR SELECT
  USING (true);

CREATE POLICY "cms_content_insert_admin"
  ON public.cms_content FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "cms_content_update_admin"
  ON public.cms_content FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "cms_content_delete_admin"
  ON public.cms_content FOR DELETE
  USING (public.is_admin());

-- ---- proposals --------------------------------------------------------------
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "proposals_select_public"
  ON public.proposals FOR SELECT
  USING (true);

CREATE POLICY "proposals_insert_admin"
  ON public.proposals FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "proposals_update_admin"
  ON public.proposals FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "proposals_delete_admin"
  ON public.proposals FOR DELETE
  USING (public.is_admin());

-- =============================================================================
-- 2. PROFILES — users read/update own (cannot change role), admin reads all
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- =============================================================================
-- 3. CART_ITEMS — users manage own, admin can view all
-- =============================================================================
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cart_items_select_own"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "cart_items_insert_own"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_items_update_own"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_items_delete_own"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "cart_items_select_admin"
  ON public.cart_items FOR SELECT
  USING (public.is_admin());

-- =============================================================================
-- 4. WISHLISTS — users manage own, admin can view
-- =============================================================================
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wishlists_select_own"
  ON public.wishlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "wishlists_insert_own"
  ON public.wishlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "wishlists_update_own"
  ON public.wishlists FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "wishlists_delete_own"
  ON public.wishlists FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "wishlists_select_admin"
  ON public.wishlists FOR SELECT
  USING (public.is_admin());

-- =============================================================================
-- 5. WISHLIST_ITEMS — users manage own (ownership checked via wishlist)
-- =============================================================================
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wishlist_items_select_own"
  ON public.wishlist_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id
        AND wishlists.user_id = auth.uid()
    )
  );

CREATE POLICY "wishlist_items_insert_own"
  ON public.wishlist_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id
        AND wishlists.user_id = auth.uid()
    )
  );

CREATE POLICY "wishlist_items_update_own"
  ON public.wishlist_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id
        AND wishlists.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id
        AND wishlists.user_id = auth.uid()
    )
  );

CREATE POLICY "wishlist_items_delete_own"
  ON public.wishlist_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id
        AND wishlists.user_id = auth.uid()
    )
  );

CREATE POLICY "wishlist_items_select_admin"
  ON public.wishlist_items FOR SELECT
  USING (public.is_admin());

-- =============================================================================
-- 6. ORDERS — users read/create own, admin full access
-- =============================================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_select_admin"
  ON public.orders FOR SELECT
  USING (public.is_admin());

CREATE POLICY "orders_insert_admin"
  ON public.orders FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "orders_update_admin"
  ON public.orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "orders_delete_admin"
  ON public.orders FOR DELETE
  USING (public.is_admin());

-- =============================================================================
-- 7. ORDER_ITEMS — users read/insert own (via order), admin full access
-- =============================================================================
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select_own"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_insert_own"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_select_admin"
  ON public.order_items FOR SELECT
  USING (public.is_admin());

CREATE POLICY "order_items_insert_admin"
  ON public.order_items FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "order_items_update_admin"
  ON public.order_items FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "order_items_delete_admin"
  ON public.order_items FOR DELETE
  USING (public.is_admin());


-- =============================================================================
-- ROLLBACK SQL
-- =============================================================================
-- To undo this migration, run the following statements:
--
-- DROP POLICY IF EXISTS "products_select_public" ON public.products;
-- DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
-- DROP POLICY IF EXISTS "products_update_admin" ON public.products;
-- DROP POLICY IF EXISTS "products_delete_admin" ON public.products;
-- ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
--
-- DROP POLICY IF EXISTS "categories_select_public" ON public.categories;
-- DROP POLICY IF EXISTS "categories_insert_admin" ON public.categories;
-- DROP POLICY IF EXISTS "categories_update_admin" ON public.categories;
-- DROP POLICY IF EXISTS "categories_delete_admin" ON public.categories;
-- ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
--
-- DROP POLICY IF EXISTS "services_select_public" ON public.services;
-- DROP POLICY IF EXISTS "services_insert_admin" ON public.services;
-- DROP POLICY IF EXISTS "services_update_admin" ON public.services;
-- DROP POLICY IF EXISTS "services_delete_admin" ON public.services;
-- ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
--
-- DROP POLICY IF EXISTS "souvenir_packages_select_public" ON public.souvenir_packages;
-- DROP POLICY IF EXISTS "souvenir_packages_insert_admin" ON public.souvenir_packages;
-- DROP POLICY IF EXISTS "souvenir_packages_update_admin" ON public.souvenir_packages;
-- DROP POLICY IF EXISTS "souvenir_packages_delete_admin" ON public.souvenir_packages;
-- ALTER TABLE public.souvenir_packages DISABLE ROW LEVEL SECURITY;
--
-- DROP POLICY IF EXISTS "testimonials_select_public" ON public.testimonials;
-- DROP POLICY IF EXISTS "testimonials_insert_admin" ON public.testimonials;
-- DROP POLICY IF EXISTS "testimonials_update_admin" ON public.testimonials;
-- DROP POLICY IF EXISTS "testimonials_delete_admin" ON public.testimonials;
-- ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;
--
-- DROP POLICY IF EXISTS "cms_content_select_public" ON public.cms_content;
-- DROP POLICY IF EXISTS "cms_content_insert_admin" ON public.cms_content;
-- DROP POLICY IF EXISTS "cms_content_update_admin" ON public.cms_content;
-- DROP POLICY IF EXISTS "cms_content_delete_admin" ON public.cms_content;
-- ALTER TABLE public.cms_content DISABLE ROW LEVEL SECURITY;
--
-- DROP POLICY IF EXISTS "proposals_select_public" ON public.proposals;
-- DROP POLICY IF EXISTS "proposals_insert_admin" ON public.proposals;
-- DROP POLICY IF EXISTS "proposals_update_admin" ON public.proposals;
-- DROP POLICY IF EXISTS "proposals_delete_admin" ON public.proposals;
-- ALTER TABLE public.proposals DISABLE ROW LEVEL SECURITY;
--
-- DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
-- DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
-- DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
--
-- DROP POLICY IF EXISTS "cart_items_select_own" ON public.cart_items;
-- DROP POLICY IF EXISTS "cart_items_insert_own" ON public.cart_items;
-- DROP POLICY IF EXISTS "cart_items_update_own" ON public.cart_items;
-- DROP POLICY IF EXISTS "cart_items_delete_own" ON public.cart_items;
-- DROP POLICY IF EXISTS "cart_items_select_admin" ON public.cart_items;
-- ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;
--
-- DROP POLICY IF EXISTS "wishlists_select_own" ON public.wishlists;
-- DROP POLICY IF EXISTS "wishlists_insert_own" ON public.wishlists;
-- DROP POLICY IF EXISTS "wishlists_update_own" ON public.wishlists;
-- DROP POLICY IF EXISTS "wishlists_delete_own" ON public.wishlists;
-- DROP POLICY IF EXISTS "wishlists_select_admin" ON public.wishlists;
-- ALTER TABLE public.wishlists DISABLE ROW LEVEL SECURITY;
--
-- DROP POLICY IF EXISTS "wishlist_items_select_own" ON public.wishlist_items;
-- DROP POLICY IF EXISTS "wishlist_items_insert_own" ON public.wishlist_items;
-- DROP POLICY IF EXISTS "wishlist_items_update_own" ON public.wishlist_items;
-- DROP POLICY IF EXISTS "wishlist_items_delete_own" ON public.wishlist_items;
-- DROP POLICY IF EXISTS "wishlist_items_select_admin" ON public.wishlist_items;
-- ALTER TABLE public.wishlist_items DISABLE ROW LEVEL SECURITY;
--
-- DROP POLICY IF EXISTS "orders_select_own" ON public.orders;
-- DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;
-- DROP POLICY IF EXISTS "orders_select_admin" ON public.orders;
-- DROP POLICY IF EXISTS "orders_insert_admin" ON public.orders;
-- DROP POLICY IF EXISTS "orders_update_admin" ON public.orders;
-- DROP POLICY IF EXISTS "orders_delete_admin" ON public.orders;
-- ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
--
-- DROP POLICY IF EXISTS "order_items_select_own" ON public.order_items;
-- DROP POLICY IF EXISTS "order_items_insert_own" ON public.order_items;
-- DROP POLICY IF EXISTS "order_items_select_admin" ON public.order_items;
-- DROP POLICY IF EXISTS "order_items_insert_admin" ON public.order_items;
-- DROP POLICY IF EXISTS "order_items_update_admin" ON public.order_items;
-- DROP POLICY IF EXISTS "order_items_delete_admin" ON public.order_items;
-- ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
--
-- DROP FUNCTION IF EXISTS public.is_admin();
