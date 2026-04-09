-- =============================================================================
-- Migration: 20260408_001_initial_schema.sql
-- Description: Initial schema for GREENLABS.Studio succulent store
-- Risk: Low | Confidence: High
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- Shared trigger function: auto-update updated_at on row modification
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 3.1 profiles
-- Relationship: auth.users 1--1 profiles
-- =============================================================================
CREATE TABLE profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text        NOT NULL,
  avatar_url  text,
  phone       text,
  role        text        NOT NULL DEFAULT 'user'
                          CHECK (role IN ('admin', 'user')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger: auto-create profile row when a new auth.users row is inserted
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- 3.2 categories
-- Relationship: categories 1--N products
-- =============================================================================
CREATE TABLE categories (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  slug        text        NOT NULL UNIQUE,
  description text,
  image_url   text,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_categories_slug ON categories (slug);
CREATE INDEX idx_categories_sort_order ON categories (sort_order);

-- =============================================================================
-- 3.3 products
-- Relationship: products N--1 categories
-- =============================================================================
CREATE TABLE products (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text          NOT NULL,
  slug        text          NOT NULL UNIQUE,
  description text,
  price       numeric(10,2) NOT NULL CHECK (price >= 0),
  images      text[]        NOT NULL DEFAULT '{}',
  care_guide  text,
  category_id uuid          REFERENCES categories(id) ON DELETE SET NULL,
  light_needs text          CHECK (light_needs IN ('low', 'medium', 'high')),
  water_needs text          CHECK (water_needs IN ('low', 'medium', 'high')),
  is_featured boolean       NOT NULL DEFAULT false,
  stock       integer       NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active   boolean       NOT NULL DEFAULT true,
  created_at  timestamptz   NOT NULL DEFAULT now(),
  updated_at  timestamptz   NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_products_slug ON products (slug);
CREATE INDEX idx_products_category_id ON products (category_id);
CREATE INDEX idx_products_is_featured ON products (is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_is_active ON products (is_active) WHERE is_active = true;

-- =============================================================================
-- 3.4 orders
-- Relationship: profiles 1--N orders
-- =============================================================================
CREATE TABLE orders (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status          text          NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending','confirmed','preparing','ready','delivered','cancelled')),
  total           numeric(10,2) NOT NULL CHECK (total >= 0),
  notes           text,
  whatsapp_sent   boolean       NOT NULL DEFAULT false,
  whatsapp_sent_at timestamptz,
  created_at      timestamptz   NOT NULL DEFAULT now(),
  updated_at      timestamptz   NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);

-- =============================================================================
-- 3.5 order_items
-- Relationship: orders 1--N order_items, order_items N--1 products
-- =============================================================================
CREATE TABLE order_items (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    uuid          REFERENCES products(id) ON DELETE SET NULL,
  quantity      integer       NOT NULL CHECK (quantity > 0),
  price_at_time numeric(10,2) NOT NULL,
  created_at    timestamptz   NOT NULL DEFAULT now(),
  updated_at    timestamptz   NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_order_items_updated_at
  BEFORE UPDATE ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_product_id ON order_items (product_id);

-- =============================================================================
-- 3.6 cart_items
-- Relationship: profiles 1--N cart_items, cart_items N--1 products
-- =============================================================================
CREATE TABLE cart_items (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  uuid        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    integer     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE TRIGGER trg_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_cart_items_user_id ON cart_items (user_id);

-- =============================================================================
-- 3.7 wishlists
-- Relationship: profiles 1--N wishlists
-- =============================================================================
CREATE TABLE wishlists (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        text        NOT NULL DEFAULT 'Favoritos',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_wishlists_updated_at
  BEFORE UPDATE ON wishlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_wishlists_user_id ON wishlists (user_id);

-- =============================================================================
-- 3.8 wishlist_items
-- Relationship: wishlists 1--N wishlist_items, wishlist_items N--1 products
-- =============================================================================
CREATE TABLE wishlist_items (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id uuid        NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id  uuid        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (wishlist_id, product_id)
);

CREATE TRIGGER trg_wishlist_items_updated_at
  BEFORE UPDATE ON wishlist_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_wishlist_items_wishlist_id ON wishlist_items (wishlist_id);

-- =============================================================================
-- 3.9 services
-- =============================================================================
CREATE TABLE services (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  slug        text        NOT NULL UNIQUE,
  description text,
  price_range text,
  images      text[]      NOT NULL DEFAULT '{}',
  is_active   boolean     NOT NULL DEFAULT true,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_services_slug ON services (slug);
CREATE INDEX idx_services_sort_order ON services (sort_order);

-- =============================================================================
-- 3.10 souvenir_packages
-- =============================================================================
CREATE TABLE souvenir_packages (
  id             uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text          NOT NULL,
  slug           text          NOT NULL UNIQUE,
  description    text,
  price          numeric(10,2) NOT NULL,
  items_included text[]        NOT NULL DEFAULT '{}',
  min_quantity   integer       NOT NULL DEFAULT 1,
  images         text[]        NOT NULL DEFAULT '{}',
  is_active      boolean       NOT NULL DEFAULT true,
  sort_order     integer       NOT NULL DEFAULT 0,
  created_at     timestamptz   NOT NULL DEFAULT now(),
  updated_at     timestamptz   NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_souvenir_packages_updated_at
  BEFORE UPDATE ON souvenir_packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_souvenir_packages_slug ON souvenir_packages (slug);
CREATE INDEX idx_souvenir_packages_sort_order ON souvenir_packages (sort_order);

-- =============================================================================
-- 3.11 testimonials
-- =============================================================================
CREATE TABLE testimonials (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  text        text        NOT NULL,
  rating      integer     NOT NULL CHECK (rating >= 1 AND rating <= 5),
  avatar_url  text,
  is_featured boolean     NOT NULL DEFAULT false,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_testimonials_is_featured ON testimonials (is_featured) WHERE is_featured = true;

-- =============================================================================
-- 3.12 cms_content
-- =============================================================================
CREATE TABLE cms_content (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  page        text        NOT NULL,
  section     text        NOT NULL,
  content     jsonb       NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page, section)
);

CREATE TRIGGER trg_cms_content_updated_at
  BEFORE UPDATE ON cms_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_cms_content_page_section ON cms_content (page, section);

-- =============================================================================
-- 3.13 proposals
-- =============================================================================
CREATE TABLE proposals (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL,
  slug        text        NOT NULL UNIQUE,
  description text,
  product_ids uuid[]      NOT NULL DEFAULT '{}',
  is_active   boolean     NOT NULL DEFAULT true,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_proposals_slug ON proposals (slug);
CREATE INDEX idx_proposals_is_active ON proposals (is_active) WHERE is_active = true;

-- =============================================================================
-- ROLLBACK SQL
-- Run these statements in reverse order to undo this migration.
-- =============================================================================
-- DROP TABLE IF EXISTS proposals CASCADE;
-- DROP TABLE IF EXISTS cms_content CASCADE;
-- DROP TABLE IF EXISTS testimonials CASCADE;
-- DROP TABLE IF EXISTS souvenir_packages CASCADE;
-- DROP TABLE IF EXISTS services CASCADE;
-- DROP TABLE IF EXISTS wishlist_items CASCADE;
-- DROP TABLE IF EXISTS wishlists CASCADE;
-- DROP TABLE IF EXISTS cart_items CASCADE;
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS handle_new_user();
-- DROP TABLE IF EXISTS profiles CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at();
