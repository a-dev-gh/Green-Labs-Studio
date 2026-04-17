# GREENLABS.Studio — Data Models

> Version: 1.0.0
> Author: @architect
> Date: 2026-04-17
> Status: ACTIVE — authoritative column-level shape for tables that evolve after the initial migration.

Tables not listed here are stable and defined in `supabase/migrations/20260408_001_initial_schema.sql`.

---

## `cart_items` (REVISED for guest cart — supersedes 3.6 of initial schema)

**Confidence: High | Risk: Low**

Holds pending cart rows for both authenticated users and anonymous guests. Exactly one of `user_id` / `session_id` is populated per row, enforced by CHECK.

| Column       | Type          | Null | Default             | Notes                                                                 |
|--------------|---------------|------|---------------------|-----------------------------------------------------------------------|
| `id`         | `uuid`        | no   | `gen_random_uuid()` | Primary key.                                                          |
| `user_id`    | `uuid`        | yes  | —                   | FK `profiles(id) ON DELETE CASCADE`. NULL for guest rows.             |
| `session_id` | `text`        | yes  | —                   | UUID v4 string from `crypto.randomUUID()`. NULL for authed rows.      |
| `product_id` | `uuid`        | no   | —                   | FK `products(id) ON DELETE CASCADE`.                                  |
| `quantity`   | `integer`     | no   | `1`                 | CHECK `quantity > 0`.                                                 |
| `created_at` | `timestamptz` | no   | `now()`             |                                                                       |
| `updated_at` | `timestamptz` | no   | `now()`             | Maintained by `trg_cart_items_updated_at`.                            |

### Constraints

- CHECK `(user_id IS NOT NULL) <> (session_id IS NOT NULL)` — exactly one identity source.
- Partial UNIQUE `(user_id, product_id) WHERE user_id IS NOT NULL`.
- Partial UNIQUE `(session_id, product_id) WHERE session_id IS NOT NULL`.

### Indexes

- `idx_cart_items_user_id    ON cart_items (user_id)    WHERE user_id    IS NOT NULL`.
- `idx_cart_items_session_id ON cart_items (session_id) WHERE session_id IS NOT NULL`.

### RLS

- **Authenticated users**: SELECT/INSERT/UPDATE/DELETE own rows where `auth.uid() = user_id AND session_id IS NULL`.
- **Admins**: SELECT all.
- **Anonymous users**: *no direct policies*. All guest access is via SECURITY DEFINER RPCs (`guest_cart_*`, `merge_guest_cart`) which internally scope by `p_session_id`.

### TypeScript shape (`src/lib/types.ts`)

```ts
export interface CartItem {
  id: string;
  user_id: string | null;
  session_id: string | null;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}
```

See `docs/architecture.md` § 11 "Guest Cart (Session-ID Unified Schema)" for end-to-end design, RPC list, client contract, and security review.
