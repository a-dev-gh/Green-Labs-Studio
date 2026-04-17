-- =============================================================================
-- Migration: 20260417_007_seed_products_services.sql
-- Description: Idempotent seed data so the catalog and services pages are not
--              empty after initial DB setup. Inserts 4 products and 3
--              services. `images` are left as empty arrays — Oscar will
--              upload them through the admin CMS once the storage bucket
--              (migration 006) is in place. `category_id` is NULL for all
--              products; categories can be assigned later via admin.
--
-- Source spec: docs/architecture.md Sections 3.3 (products) and 3.9 (services)
-- Depends on:  20260408_001_initial_schema.sql
--
-- Idempotency: every INSERT uses ON CONFLICT (slug) DO NOTHING, so re-running
-- this migration on an already-seeded database is safe and a no-op.
--
-- Risk: Low | Confidence: High
-- Human approval: APPROVED by Oscar (2026-04-17)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Products (4 rows)
-- Columns present in products table (per 20260408_001_initial_schema.sql):
--   name, slug, description, price, images, care_guide, category_id,
--   light_needs, water_needs, is_featured, stock, is_active
-- Note: no `scientific_name` column exists in the current schema, so it is
-- intentionally omitted here. See assumption note in the PR description.
-- ---------------------------------------------------------------------------

INSERT INTO products (
  name, slug, description, price, images, care_guide,
  category_id, light_needs, water_needs, is_featured, stock, is_active
) VALUES
  (
    'Echeveria ''Hercules''',
    'echeveria-hercules',
    'Roseta clásica de color verde intenso, resistente al sol directo.',
    550,
    ARRAY[]::text[],
    'Riega cada 10-14 días. Luz directa mínimo 4h. Tierra con buen drenaje.',
    NULL,
    'high',
    'low',
    true,
    10,
    true
  ),
  (
    'Echeveria ''Perle von Nürnberg''',
    'echeveria-perle',
    'Colores púrpura y rosa espectaculares, fácil de cuidar.',
    480,
    ARRAY[]::text[],
    'Luz indirecta brillante. Riego semanal. Evita exceso de agua.',
    NULL,
    'medium',
    'medium',
    true,
    10,
    true
  ),
  (
    'Kalanchoe orgyalis',
    'kalanchoe-orgyalis',
    'Extremadamente resistente. Ideal para exteriores y principiantes.',
    420,
    ARRAY[]::text[],
    'Sol directo o indirecto. Riego mínimo. Tolera sequía.',
    NULL,
    'high',
    'low',
    false,
    10,
    true
  ),
  (
    'Kalanchoe tomentosa',
    'kalanchoe-tomentosa',
    'Textura aterciopelada única, perfecta para espacios pequeños.',
    380,
    ARRAY[]::text[],
    'Luz indirecta. Riego moderado cada 10 días. Evita hojas mojadas.',
    NULL,
    'medium',
    'medium',
    false,
    10,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Services (3 rows)
-- Columns present in services table (per 20260408_001_initial_schema.sql):
--   name, slug, description, price_range, images, is_active, sort_order
-- Note: no `minimum` / `min_quantity` column exists on services — that column
-- lives on souvenir_packages, not services. Skipped per spec.
-- ---------------------------------------------------------------------------

INSERT INTO services (
  name, slug, description, price_range, images, is_active, sort_order
) VALUES
  (
    'Bodas',
    'bodas',
    'Suculentas elegantes como recuerdo para tus invitados. Personalizadas con etiquetas, macetas decorativas y empaque artesanal.',
    'Desde RD$ 250/unidad',
    ARRAY[]::text[],
    true,
    1
  ),
  (
    'Cumpleaños',
    'cumpleanos',
    'Mini suculentas perfectas como souvenirs de cumpleaños. Variedad de especies y presentaciones para cualquier temática.',
    'Desde RD$ 200/unidad',
    ARRAY[]::text[],
    true,
    2
  ),
  (
    'Corporativo',
    'corporativo',
    'Suculentas premium para eventos empresariales, conferencias y regalos corporativos. Presentación ejecutiva con branding personalizado.',
    'Desde RD$ 350/unidad',
    ARRAY[]::text[],
    true,
    3
  )
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- ROLLBACK SQL
-- Deletes only the rows inserted by this migration (keyed by slug). Safe to
-- run even if some rows were already manually removed.
-- =============================================================================
-- DELETE FROM products WHERE slug IN (
--   'echeveria-hercules',
--   'echeveria-perle',
--   'kalanchoe-orgyalis',
--   'kalanchoe-tomentosa'
-- );
-- DELETE FROM services WHERE slug IN (
--   'bodas',
--   'cumpleanos',
--   'corporativo'
-- );
