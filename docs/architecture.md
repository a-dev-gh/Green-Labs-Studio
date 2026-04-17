# GREENLABS.Studio — System Architecture

> Version: 1.0.0
> Author: @architect
> Date: 2026-04-08
> Status: COMPLETE — ready for TASK-002 (db-builder) and TASK-003 (auth-builder)

---

## 1. Route Structure

**Confidence: High | Risk: Low**

React Router v6 with lazy-loaded route components. All public routes are Spanish-facing. Admin routes are guarded by role check.

```
/                           → Landing (public)
/catalogo                   → Catalog (public)
/catalogo/:slug             → ProductModal overlay rendered inside Catalog (public)
                              Note: /catalogo/:slug is a nested child route of /catalogo.
                              The modal overlays the product grid without unmounting it.
                              Navigating to /catalogo/:slug directly (e.g. shared URL, page
                              refresh) loads Catalog with the modal open. Closing the modal
                              navigates back to /catalogo. See Section 13 for full details.
/servicios                  → Services & Souvenir Packages (public)
/carrito                    → Cart (public — guest cart via session_id; soft login banner shown)
/cuestionario               → Quiz (public)
/nosotros                   → About (public)
/cuenta                     → Account layout (auth required)
  /cuenta/perfil            → Profile settings
  /cuenta/pedidos           → Order history
  /cuenta/listas            → Wishlists
  /cuenta/configuracion     → Account settings (password reset, etc.)
/admin                      → Admin layout (admin role required)
  /admin/productos          → Products CRUD
  /admin/categorias         → Categories CRUD
  /admin/servicios          → Services CRUD
  /admin/souvenirs          → Souvenir packages CRUD
  /admin/propuestas         → Proposals / featured collections CRUD
  /admin/testimonios        → Testimonials CRUD
  /admin/contenido          → CMS content editor (hero, about sections)
  /admin/pedidos            → Orders viewer
  /admin/usuarios           → User activity viewer
/auth/login                 → Login page (public, redirects if authed)
/auth/registro              → Signup page (public, redirects if authed)
/auth/recuperar             → Password reset request (public)
/auth/reset                 → Password reset confirmation (from email link)
/*                          → 404 NotFound (public)
```

### Router Config (src/router.tsx)

```tsx
<BrowserRouter>
  <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<Landing />} />
      <Route path="catalogo" element={<Catalog />}>
        <Route path=":slug" element={<ProductModal />} />
      </Route>
      <Route path="servicios" element={<Services />} />
      <Route path="carrito" element={<Cart />} />
      <Route path="cuestionario" element={<Quiz />} />
      <Route path="nosotros" element={<About />} />
      <Route path="auth/login" element={<Login />} />
      <Route path="auth/registro" element={<Signup />} />
      <Route path="auth/recuperar" element={<ForgotPassword />} />
      <Route path="auth/reset" element={<ResetPassword />} />
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route path="cuenta" element={<AccountLayout />}>
        <Route path="perfil" element={<Profile />} />
        <Route path="pedidos" element={<Orders />} />
        <Route path="listas" element={<Wishlists />} />
        <Route path="configuracion" element={<Settings />} />
      </Route>
    </Route>
    <Route element={<AdminRoute />}>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="productos" element={<AdminProducts />} />
        <Route path="categorias" element={<AdminCategories />} />
        <Route path="servicios" element={<AdminServices />} />
        <Route path="souvenirs" element={<AdminSouvenirs />} />
        <Route path="propuestas" element={<AdminProposals />} />
        <Route path="testimonios" element={<AdminTestimonials />} />
        <Route path="contenido" element={<AdminContent />} />
        <Route path="pedidos" element={<AdminOrders />} />
        <Route path="usuarios" element={<AdminUsers />} />
      </Route>
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

---

## 2. Component Tree

**Confidence: High | Risk: Low**

### Directory Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── PublicLayout.tsx
│   │   ├── AccountLayout.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── BottomNav.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── AccountSidebar.tsx
│   ├── auth/
│   │   ├── ProtectedRoute.tsx
│   │   ├── AdminRoute.tsx
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   └── ResetPasswordForm.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── HeroCarousel.tsx
│   │   ├── LeafAnimation.tsx
│   │   ├── AboutSection.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── SouvenirMiniSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── WhatsAppCTA.tsx
│   ├── catalog/
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductSort.tsx
│   │   ├── CategoryPills.tsx
│   │   └── ProductSearch.tsx
│   ├── product/
│   │   ├── ProductImages.tsx
│   │   ├── ProductInfo.tsx
│   │   ├── CareGuide.tsx
│   │   ├── AddToCartButton.tsx
│   │   ├── WhatsAppOrderButton.tsx
│   │   └── RelatedProducts.tsx
│   ├── services/
│   │   ├── ServiceCard.tsx
│   │   ├── ServiceList.tsx
│   │   ├── SouvenirPackageCard.tsx
│   │   ├── SouvenirPackageList.tsx
│   │   └── ServiceWhatsAppCTA.tsx
│   ├── cart/
│   │   ├── CartItemList.tsx
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   ├── CartEmpty.tsx
│   │   └── WhatsAppCheckout.tsx
│   ├── account/
│   │   ├── ProfileForm.tsx
│   │   ├── OrderHistory.tsx
│   │   ├── OrderCard.tsx
│   │   ├── WishlistList.tsx
│   │   ├── WishlistCard.tsx
│   │   ├── WishlistItemCard.tsx
│   │   ├── SettingsForm.tsx
│   │   └── AddToWishlistButton.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminProducts.tsx
│   │   ├── AdminCategories.tsx
│   │   ├── AdminServices.tsx
│   │   ├── AdminSouvenirs.tsx
│   │   ├── AdminProposals.tsx
│   │   ├── AdminTestimonials.tsx
│   │   ├── AdminContent.tsx
│   │   ├── AdminOrders.tsx
│   │   ├── AdminUsers.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── DataTable.tsx
│   │   └── AdminFormModal.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Select.tsx
│       ├── Modal.tsx
│       ├── Drawer.tsx
│       ├── Badge.tsx
│       ├── Spinner.tsx
│       ├── Skeleton.tsx
│       ├── Toast.tsx
│       ├── StarRating.tsx
│       ├── QuantitySelector.tsx
│       ├── EmptyState.tsx
│       ├── Breadcrumbs.tsx
│       ├── Pagination.tsx
│       └── ImageWithFallback.tsx
├── pages/
│   ├── Landing.tsx
│   ├── Catalog.tsx
│   ├── ProductDetail.tsx
│   ├── Services.tsx
│   ├── Cart.tsx
│   ├── Quiz.tsx
│   ├── About.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── ForgotPassword.tsx
│   ├── ResetPassword.tsx
│   ├── Profile.tsx
│   ├── Orders.tsx
│   ├── Wishlists.tsx
│   ├── Settings.tsx
│   └── NotFound.tsx
├── core/
│   ├── auth/
│   │   ├── AuthProvider.tsx
│   │   ├── useAuth.ts
│   │   └── authService.ts
│   ├── cart/
│   │   ├── CartProvider.tsx
│   │   ├── useCart.ts
│   │   └── sessionId.ts
│   ├── wishlist/
│   │   ├── WishlistProvider.tsx
│   │   └── useWishlist.ts
│   └── supabase.ts
├── hooks/
│   ├── useProducts.ts
│   ├── useProduct.ts
│   ├── useCategories.ts
│   ├── useServices.ts
│   ├── useSouvenirPackages.ts
│   ├── useTestimonials.ts
│   ├── useProposals.ts
│   ├── useCmsContent.ts
│   ├── useOrders.ts
│   ├── useScrollAnimation.ts
│   └── useDebounce.ts
├── lib/
│   ├── whatsapp.ts
│   ├── formatters.ts
│   ├── validators.ts
│   ├── constants.ts
│   └── types.ts
├── styles/                (see Section 8)
├── router.tsx
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

---

## 3. Data Models (Supabase / PostgreSQL)

**Confidence: High | Risk: Low**

All tables use `uuid` PKs via `gen_random_uuid()`. All include `created_at` and `updated_at` (auto-managed by trigger).

### 3.1 profiles
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, REFERENCES auth.users(id) ON DELETE CASCADE |
| full_name | text | NOT NULL |
| avatar_url | text | NULL |
| phone | text | NULL |
| role | text | NOT NULL, DEFAULT 'user', CHECK (role IN ('admin', 'user')) |
| created_at | timestamptz | NOT NULL, DEFAULT now() |
| updated_at | timestamptz | NOT NULL, DEFAULT now() |

Trigger: On `auth.users` INSERT → create `profiles` row with `role = 'user'`.

### 3.2 categories
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, DEFAULT gen_random_uuid() |
| name | text | NOT NULL |
| slug | text | NOT NULL, UNIQUE |
| description | text | NULL |
| image_url | text | NULL |
| sort_order | integer | NOT NULL, DEFAULT 0 |

### 3.3 products
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, DEFAULT gen_random_uuid() |
| name | text | NOT NULL |
| slug | text | NOT NULL, UNIQUE |
| description | text | NULL |
| price | numeric(10,2) | NOT NULL, CHECK (price >= 0) |
| images | text[] | NOT NULL, DEFAULT '{}' |
| care_guide | text | NULL |
| category_id | uuid | FK → categories(id) ON DELETE SET NULL |
| light_needs | text | CHECK IN ('low', 'medium', 'high') |
| water_needs | text | CHECK IN ('low', 'medium', 'high') |
| is_featured | boolean | NOT NULL, DEFAULT false |
| stock | integer | NOT NULL, DEFAULT 0, CHECK (>= 0) |
| is_active | boolean | NOT NULL, DEFAULT true |

### 3.4 orders
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles(id) ON DELETE CASCADE |
| status | text | DEFAULT 'pending', CHECK IN ('pending','confirmed','preparing','ready','delivered','cancelled') |
| total | numeric(10,2) | NOT NULL, CHECK (>= 0) |
| notes | text | NULL |
| whatsapp_sent | boolean | DEFAULT false |
| whatsapp_sent_at | timestamptz | NULL |

### 3.5 order_items
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| order_id | uuid | FK → orders(id) ON DELETE CASCADE |
| product_id | uuid | FK → products(id) ON DELETE SET NULL |
| quantity | integer | NOT NULL, CHECK (> 0) |
| price_at_time | numeric(10,2) | NOT NULL |

### 3.6 cart_items
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles(id) ON DELETE CASCADE, NULL for guests |
| session_id | text | NULL for authenticated users |
| product_id | uuid | FK → products(id) ON DELETE CASCADE |
| quantity | integer | DEFAULT 1, CHECK (> 0, <= 99) |

UNIQUE on `(user_id, product_id)` and `(session_id, product_id)`. CHECK: `(user_id IS NOT NULL) <> (session_id IS NOT NULL)` — exactly one owner per row. See Section 11 for the full guest-cart design.

### 3.7 wishlists
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles(id) ON DELETE CASCADE |
| name | text | NOT NULL, DEFAULT 'Favoritos' |

### 3.8 wishlist_items
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| wishlist_id | uuid | FK → wishlists(id) ON DELETE CASCADE |
| product_id | uuid | FK → products(id) ON DELETE CASCADE |

UNIQUE on `(wishlist_id, product_id)`.

### 3.9 services
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| name | text | NOT NULL |
| slug | text | NOT NULL, UNIQUE |
| description | text | NULL |
| price_range | text | NULL |
| images | text[] | DEFAULT '{}' |
| is_active | boolean | DEFAULT true |
| sort_order | integer | DEFAULT 0 |

### 3.10 souvenir_packages
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| name | text | NOT NULL |
| slug | text | NOT NULL, UNIQUE |
| description | text | NULL |
| price | numeric(10,2) | NOT NULL |
| items_included | text[] | DEFAULT '{}' |
| min_quantity | integer | DEFAULT 1 |
| images | text[] | DEFAULT '{}' |
| is_active | boolean | DEFAULT true |
| sort_order | integer | DEFAULT 0 |

### 3.11 testimonials
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| name | text | NOT NULL |
| text | text | NOT NULL |
| rating | integer | CHECK BETWEEN 1 AND 5 |
| avatar_url | text | NULL |
| is_featured | boolean | DEFAULT false |
| sort_order | integer | DEFAULT 0 |

### 3.12 cms_content
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| page | text | NOT NULL |
| section | text | NOT NULL |
| content | jsonb | NOT NULL, DEFAULT '{}' |

UNIQUE on `(page, section)`.

### 3.13 proposals
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| title | text | NOT NULL |
| slug | text | NOT NULL, UNIQUE |
| description | text | NULL |
| product_ids | uuid[] | DEFAULT '{}' |
| is_active | boolean | DEFAULT true |
| sort_order | integer | DEFAULT 0 |

### Entity Relationships
```
auth.users 1──1 profiles
profiles 1──N orders, cart_items, wishlists
orders 1──N order_items
order_items N──1 products
cart_items N──1 products
wishlists 1──N wishlist_items
wishlist_items N──1 products
products N──1 categories
```

---

## 4. Auth Design

**Confidence: High | Risk: Low**

- **Provider:** Supabase Auth, email/password only
- **Roles:** admin (Oscar — full CMS), user (customers — cart, lists, orders)
- **Password Reset:** `resetPasswordForEmail()` → email link → `/auth/reset` → `updateUser({ password })`
- **Session:** JWT in localStorage, auto-refresh via `onAuthStateChange`
- **Master Admin Seed:** Oscar signs up, then run SQL to set `profiles.role = 'admin'`

### RLS Policies (all tables have RLS enabled)
- **Public tables** (products, categories, services, souvenirs, testimonials, cms_content, proposals): SELECT for everyone, ALL for admin
- **profiles:** Users read/update own (cannot change role), admin reads all
- **cart_items, wishlists, wishlist_items:** Users manage own, admin can view
- **orders, order_items:** Users read/create own, admin full access

---

## 5. CMS Admin Capabilities

Oscar can manage via `/admin`:
- Products CRUD + image upload
- Categories CRUD
- Services CRUD
- Souvenir packages CRUD
- Proposals / featured collections (product picker)
- Testimonials
- Landing/About content editor (hero, about, souvenir CTA)
- Orders viewer with status management
- User activity viewer (read-only)

---

## 6. State Management

Three React Context providers, no Redux:
- **AuthContext:** user, profile, isAdmin, login/signup/logout/resetPassword
- **CartContext:** items, total, add/remove/update, generateWhatsAppLink
- **WishlistContext:** wishlists, create/delete, addItem/removeItem

Nesting: `AuthProvider > CartProvider > WishlistProvider > Router`

---

## 7. Key Integrations

- **WhatsApp:** `wa.me/{number}?text={encoded_order}` — number stored in `VITE_WHATSAPP_NUMBER`
- **Supabase Storage:** Buckets: product-images, service-images, avatars, cms-images
- **Google Fonts:** DM Sans + Lora via `<link>` in index.html

---

## 8. CSS Architecture

Custom CSS with BEM naming. Design tokens in `tokens.css`.

```css
:root {
  --color-forest: #1B4332;
  --color-olive: #8BA740;
  --color-coral: #EF583D;
  --color-sand: #F5F0E8;
  --font-ui: 'DM Sans', sans-serif;
  --font-editorial: 'Lora', serif;
  --radius-md: 12px;
  --space-2: 0.5rem; /* 8px grid base */
}
```

Mobile-first responsive: base → 640px (tablet) → 1024px (desktop) → 1280px (wide).

---

## 9. Environment Variables
```env
VITE_SUPABASE_URL=         # BLOCKED
VITE_SUPABASE_ANON_KEY=    # BLOCKED
VITE_WHATSAPP_NUMBER=      # BLOCKED
```

---

## 10. Blocked Items

| Item | Owner |
|---|---|
| WhatsApp number | Adrian / Oscar |
| Supabase project credentials | Adrian |
| Oscar's admin email | Adrian |
| Domain DNS (greenlabs.studio) | Adrian |

---

## 11. Guest Cart (Session-ID Unified Schema)

> Author: @architect
> Date: 2026-04-17
> Status: DESIGN — ready for db-builder (migration) and ui-builder (client wiring)
> Supersedes: the auth-only `cart_items` contract from Section 3.6 of the initial schema.

**Confidence: High | Risk: Medium**

### 11.1 Goal

Allow anonymous visitors to add succulents to a cart and check out via WhatsApp without creating an account, while preserving the existing authenticated-user cart flow and enabling a seamless merge when a guest later logs in.

### 11.2 Chosen approach — Unified `cart_items` with exclusive `user_id` / `session_id`

A single `cart_items` table holds both guest and authenticated rows. Each row is owned by exactly one of:

- `user_id uuid` (authenticated — FK to `profiles.id`), or
- `session_id text` (guest — cryptographically random UUID v4 stored in browser `localStorage`).

CHECK constraint: `(user_id IS NOT NULL) <> (session_id IS NOT NULL)`.

**Why unified (not a separate `guest_cart_items` table):**
- One RLS surface, one TypeScript shape, one merge routine, one query in CartProvider.
- Merge-on-login is a single `UPDATE`/`INSERT...ON CONFLICT` instead of cross-table migration.
- Admin "view all carts" dashboards stay a single query.

### 11.3 RLS — RPC-only anon access (REJECTED header approach)

We evaluated two options:

- **Option A — `x-session-id` header in RLS USING clause.** Rejected. PostgREST custom-header forwarding is inconsistent, the session id travels on every request widening exposure, and troubleshooting tends to open policies too widely.
- **Option B — RPC-only (CHOSEN).** Anon has no direct SELECT/INSERT/UPDATE/DELETE on `cart_items`. All guest access is via `SECURITY DEFINER` RPCs that take `p_session_id text` as a parameter, validate its shape, and scope all access to rows where `session_id = p_session_id`.

RPC suite:

- `guest_cart_list(p_session_id text) → TABLE(...)`
- `guest_cart_add(p_session_id text, p_product_id uuid, p_quantity int) → void`
- `guest_cart_update_quantity(p_session_id text, p_product_id uuid, p_quantity int) → void`
- `guest_cart_remove(p_session_id text, p_product_id uuid) → void`
- `guest_cart_clear(p_session_id text) → void`
- `merge_guest_cart(p_session_id text) → integer` (auth-only; moves rows to `auth.uid()`)

See the migration file `supabase/migrations/20260417_005_guest_cart_session_id.sql` (owned by db-builder) for the full SQL.

### 11.4 Client contract

`src/core/cart/sessionId.ts` (new):

```ts
const SESSION_KEY = 'greenlabs:guest_session_id';
export function getOrCreateSessionId(): string;  // v4 via crypto.randomUUID
export function getSessionId(): string | null;
export function clearSessionId(): void;          // called after merge on login
```

`CartProvider.tsx` branches on `user`:

- `user` present → existing path, `supabase.from('cart_items')`.
- `user` null → `supabase.rpc('guest_cart_*', { p_session_id })`.

Context shape (`items`, `addItem`, `removeItem`, etc.) is unchanged so consumers don't change.

**Merge-on-login flow:**

1. `useAuth()` transitions `user: null → user: <id>`.
2. CartProvider effect sees the transition, reads `getSessionId()`.
3. If a guest session exists: call `merge_guest_cart({ p_session_id })`, then `clearSessionId()`, then `fetchCart()` against the authed identity.
4. `merge_guest_cart` (SECURITY DEFINER) upserts guest rows into `(user_id, product_id)`, combining quantities on conflict, then deletes remaining guest rows.

### 11.5 TypeScript interface — `src/lib/types.ts`

```ts
export interface CartItem {
  id: string;
  user_id: string | null;     // was: string
  session_id: string | null;  // NEW
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}
```

### 11.6 Security review

- **Unguessable session ids.** `crypto.randomUUID()` = 122 random bits, ~5.3×10³⁶ values; brute force infeasible under normal rate limits.
- **Session id never leaves localStorage + RPC body.** Not in URLs, not in headers, HTTPS only.
- **Shape validation server-side.** RPCs reject non-UUID-shaped input.
- **No anon SELECT policy on `cart_items`.** Even with a leaked session id, direct DML is blocked; only RPC access is possible.
- **Cart data is low-sensitivity.** Product ids + quantities only. No PII or payment info (WhatsApp handles checkout out of band).
- **Post-MVP nice-to-have:** scheduled TTL job to delete guest rows older than 30 days.
- **Residual risk: cross-device XSS.** If an XSS ships, localStorage leaks; mitigated by CSP. Stolen guest cart confers no PII and no account takeover.

### 11.7 Handoff

- **db-builder** writes `supabase/migrations/20260417_005_guest_cart_session_id.sql` using the architect-specified SQL. Oscar must approve before applying.
- **ui-builder** creates `src/core/cart/sessionId.ts`, updates `CartProvider.tsx` to branch, un-gates `/carrito` in `src/router.tsx`, updates `CartItem` in `src/lib/types.ts`, adds soft "Inicia sesión" banner on `Cart.tsx` for guests.
- **documenter** updates README + this doc's Route Structure to mark `/carrito` public, adds `/cuestionario` and `/nosotros` routes, documents guest-cart flow for future contributors.

---

## 12. Image Storage — `greenlabs-images` Bucket

> Author: @architect
> Date: 2026-04-17
> Status: DESIGN — ready for db-builder (migration 006) and ui-builder (ImageUploader)

**Confidence: High | Risk: Low**

### 12.1 Bucket

- **Bucket id / name:** `greenlabs-images`
- **Public:** `true` (anon SELECT via CDN)
- **Write access:** admin role only (via `public.is_admin()` helper)
- Migration file: `supabase/migrations/20260417_006_storage_bucket.sql`

### 12.2 Folder + file naming conventions

- Products: `products/{product-slug}/`
- Services: `services/{service-slug}/`
- File name pattern: `{timestamp}-{kebab-name}.webp`.
- Max files per product: **6**. Max file size: **2 MB** (enforced client-side in `ImageUploader`).
- All uploads are WEBP. JPG/PNG inputs are converted to WEBP in-browser via `<canvas>.toBlob('image/webp', 0.85)` before upload.

### 12.3 RLS SQL

```sql
insert into storage.buckets (id, name, public)
values ('greenlabs-images', 'greenlabs-images', true)
on conflict (id) do nothing;

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
```

### 12.4 URL storage

`products.images` and `services.images` store **fully-qualified public URLs** (not paths). Compose via `supabase.storage.from('greenlabs-images').getPublicUrl(path).data.publicUrl`.

### 12.5 Cleanup contract

When an admin deletes a product/service row, the admin UI **must first** call `supabase.storage.from('greenlabs-images').remove([...paths])` for every URL in `images[]` (paths extracted via `pathFromUrl()` helper), then delete the DB row.

Known gap (v1): no background sweeper for mid-upload crashes. Acceptable; revisit when volume grows.

---

## 13. Product Modal Routing Pattern

> Author: @architect
> Date: 2026-04-17
> Status: DESIGN — ready for ui-builder

### 13.1 Route structure

```tsx
<Route path="catalogo" element={<Catalog />}>
  <Route path=":slug" element={<ProductModal />} />
</Route>
```

`Catalog.tsx` renders `<Outlet />` so the modal overlays the grid without unmounting it. Scroll position, search, filters preserved on open/close.

### 13.2 Canonical URL

- `/catalogo` — grid only.
- `/catalogo/:slug` — grid + modal open. This is the canonical product URL.

### 13.3 Close behavior

```ts
if (window.history.length > 1) navigate(-1);
else navigate('/catalogo');
```

Triggers: backdrop click, ESC, × button.

### 13.4 Accessibility

- Focus trap, initial focus on close button.
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` on product name.
- Body scroll lock while open.

### 13.5 Fate of `ProductDetail.tsx`

Left in place but **unused** in v1. Old standalone route removed. Flagged for deletion in next cleanup.

---

## 14. `ImageUploader` Component Contract

> Author: @architect
> Date: 2026-04-17
> Status: DESIGN — ready for ui-builder

### 14.1 Props

```ts
type ImageUploaderProps = {
  value: string[];                   // array of public URLs
  onChange: (urls: string[]) => void;
  folder: string;                    // e.g. "products/echeveria-hercules" — no trailing slash
  maxFiles?: number;                 // default 6
  maxBytesPerFile?: number;          // default 2 * 1024 * 1024
  accept?: string;                   // default "image/webp, image/jpeg, image/png"
};
```

### 14.2 Behavior

For each dropped/selected file:
1. Validate size + type.
2. If not WEBP, convert via `<canvas>.toBlob('image/webp', 0.85)`.
3. Upload: `supabase.storage.from('greenlabs-images').upload(${folder}/${Date.now()}-${kebab(name)}.webp, blob)`.
4. Resolve public URL; call `onChange([...value, url])`.

Per-file progress bars. No optimistic preview — previews only after upload resolves. Errors surface as inline toasts.

### 14.3 Delete + reorder

- Delete: `supabase.storage.remove([pathFromUrl(url)])` then `onChange(value.filter(u => u !== url))`.
- Reorder: drag handle on thumbs; `onChange(newOrder)` (no storage round-trip — paths don't change).
- Block new drops when `value.length >= maxFiles`.

### 14.4 Helpers — `src/lib/storage.ts` (new)

```ts
export function uploadImage(folder: string, file: File | Blob): Promise<string>;
export function deleteImage(url: string): Promise<void>;
export function pathFromUrl(url: string): string; // strips ".../storage/v1/object/public/greenlabs-images/"
```

---

## 15. Care-badge SVG Icon Spec

> Author: @architect
> Date: 2026-04-17
> Status: DESIGN — ready for ui-builder

### 15.1 Icon set (6 components)

- `IconSunLow`, `IconSunMedium`, `IconSunHigh`
- `IconWaterLow`, `IconWaterMedium`, `IconWaterHigh`

Lives at `src/components/ui/icons/*.tsx`. One file per icon.

### 15.2 Shared visual rules

- `viewBox="0 0 20 20"`.
- `stroke-width="1.5"`, `strokeLinecap="round"`, `strokeLinejoin="round"`.
- `stroke="currentColor"` — parent controls color.
- No fills (except optional accent dots, max 2 per icon).
- Single `<path>` when feasible; else `<circle>` + `<line>` (no `<g>`).

### 15.3 Progressive complexity

Sun (light intensity):
- `IconSunLow` — half-sun on horizon, 1 short ray.
- `IconSunMedium` — full sun circle, 4 rays (N/E/S/W).
- `IconSunHigh` — full sun circle, 8 rays (cardinals + ordinals); stroke nudged to 1.75.

Water (watering frequency):
- `IconWaterLow` — 1 droplet.
- `IconWaterMedium` — 2 overlapping droplets.
- `IconWaterHigh` — 3 droplets, triangle layout.

### 15.4 Signature

```tsx
import type { SVGProps } from 'react';
export default function IconSunLow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* paths */}
    </svg>
  );
}
```

### 15.5 Consumption

`src/components/catalog/CareBadges.tsx` maps `light_needs` / `water_needs` enums (`low | medium | high`) to the correct icon + Spanish label. On cards: icon-only pills. Inside modal: icon + label. Parent sets `color: var(--color-forest)` to drive stroke.
