-- =============================================================================
-- Migration: 20260408_002_enable_rls.sql
-- Description: Enable Row Level Security on ALL tables
-- Note: Policies are NOT created here — auth-builder handles that
-- Risk: Low | Confidence: High
-- =============================================================================

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists         ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE services          ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenir_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials      ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content       ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals         ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- ROLLBACK SQL
-- =============================================================================
-- ALTER TABLE profiles          DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE categories        DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE products          DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders            DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE order_items       DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE cart_items        DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE wishlists         DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE wishlist_items    DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE services          DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE souvenir_packages DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE testimonials      DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE cms_content       DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE proposals         DISABLE ROW LEVEL SECURITY;
