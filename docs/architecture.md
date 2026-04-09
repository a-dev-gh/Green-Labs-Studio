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
/catalogo/:slug             → ProductDetail (public)
/servicios                  → Services & Souvenir Packages (public)
/carrito                    → Cart (auth required)
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
      <Route path="catalogo" element={<Catalog />} />
      <Route path="catalogo/:slug" element={<ProductDetail />} />
      <Route path="servicios" element={<Services />} />
      <Route path="auth/login" element={<Login />} />
      <Route path="auth/registro" element={<Signup />} />
      <Route path="auth/recuperar" element={<ForgotPassword />} />
      <Route path="auth/reset" element={<ResetPassword />} />
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route path="carrito" element={<Cart />} />
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
│   │   └── useCart.ts
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
| user_id | uuid | FK → profiles(id) ON DELETE CASCADE |
| product_id | uuid | FK → products(id) ON DELETE CASCADE |
| quantity | integer | DEFAULT 1, CHECK (> 0) |

UNIQUE on `(user_id, product_id)` — use UPSERT.

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
