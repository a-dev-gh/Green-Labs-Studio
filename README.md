# GREENLABS.Studio

Succulent store website for **GREENLABS Botanics** — Santiago de los Caballeros, Dominican Republic.

Built for O. E. Orders are fulfilled via WhatsApp. The site includes a full product catalog, event souvenir service, authenticated customer accounts, a blog, and a CMS admin dashboard for Oscar to manage all content.

---

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB%20%2B%20Storage-3ECF8E?style=flat&logo=supabase&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-Custom%20%2F%20BEM-1572B6?style=flat&logo=css3&logoColor=white)

---

## Live

[greenlabsstudio.adraa19al.workers.dev](https://greenlabsstudio.adraa19al.workers.dev)

---

## Features

- **Product Catalog** — Filterable succulent grid with category pills, sorting, and client-side fuzzy search (diacritic-insensitive, matched text highlighted)
- **Product Modal with Photo Gallery** — Clicking any product card or sharing a `/catalogo/:slug` URL opens an overlay modal with a main image, thumbnail strip, and full-screen lightbox; browser back closes the modal cleanly
- **SVG Care Badges** — Six custom inline SVG icons (three sun levels, three water levels) rendered as pills on every product card and with labels inside the modal
- **Succulent Quiz** — Interactive quiz at `/cuestionario` to help visitors find the right succulent for their space
- **Guest WhatsApp Checkout** — Any visitor can add items to a cart and check out via WhatsApp without creating an account; cart merges automatically on login
- **Souvenir Service** — Dedicated page for event souvenir packages (weddings, birthdays, corporate) with an alternating full-bleed editorial layout and WhatsApp inquiry CTA per service
- **Services CMS** — Oscar adds, edits, reorders, and deletes services from `/admin/servicios` with drag-and-drop photo uploads; no code required
- **Drag-and-Drop Photo Uploads** — Admin image uploader handles Supabase Storage uploads, per-file progress, preview thumbnails, delete, and reorder; stores the final URL array on the product or service row
- **User Accounts** — Authenticated customers can manage their cart, saved wishlists, and view order history
- **About Page** — Brand story and team at `/nosotros`
- **Blog** — Editorial posts covering succulent care, event inspiration, and store news
- **Admin CMS Dashboard** — Oscar manages products, categories, services, proposals, testimonials, and landing page content — no code required
- **Scrollytelling Leaf Animation** — Animated floating leaves on the landing hero transition to white when entering the dark testimonials section

---

## Getting Started

### Setup (Supabase + env vars)

If you are setting this up for the first time — creating the Supabase project, applying migrations, and creating the admin user — follow the step-by-step guide:

**[docs/supabase-setup.md](docs/supabase-setup.md)**

That guide covers: creating the project, copying credentials, configuring `.env.local`, running all 7 migrations via the SQL Editor, uploading photos via the admin UI, creating the admin account, and verifying the guest cart flow. No CLI tools required.

### Prerequisites

- Node.js 18+
- A Supabase project with the schema applied (see `docs/supabase-setup.md` for full instructions)

### Installation

```bash
git clone https://github.com/a-dev-gh/Green-Labs-Studio.git
cd Green-Labs-Studio
npm install
```

### Environment Setup

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Then open `.env` and add your credentials (see table below).

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public API key | Yes |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number for orders (e.g. `18495252430`) | Yes |

All three variables are required for the app to function. None of these values are committed to the repository.

---

## Deployment

The site is deployed to **Cloudflare Workers** via Cloudflare Pages.

Live URL: `greenlabsstudio.adraa19al.workers.dev`

To deploy your own instance:

1. Run `npm run build` to generate the `dist/` folder.
2. Push to the connected GitHub repository.
3. Cloudflare Pages will detect the push and redeploy automatically.

Environment variables must be set in the Cloudflare Pages dashboard under **Settings > Environment Variables** — do not commit them to the repository.

---

## Project Structure

```
src/
├── components/
│   ├── layout/         # PublicLayout, AdminLayout, Navbar, Footer, BottomNav
│   ├── auth/           # ProtectedRoute, AdminRoute, Login/Signup/Reset forms
│   ├── landing/        # HeroCarousel, LeafAnimation, FeaturedProducts, Testimonials, CTAs
│   ├── catalog/        # ProductGrid, ProductCard, ProductModal, ProductGallery, CareBadges, SearchBox, ProductFilters, CategoryPills
│   ├── product/        # ProductImages, ProductInfo, CareGuide, AddToCart, RelatedProducts
│   ├── services/       # ServiceCard, SouvenirPackageCard, ServiceWhatsAppCTA
│   ├── cart/           # CartItemList, CartSummary, WhatsAppCheckout
│   ├── account/        # ProfileForm, OrderHistory, WishlistList, SettingsForm
│   ├── admin/          # Full CMS: DataTable, AdminFormModal, ImageUploader, RichTextEditor, AdminProducts, AdminServices
│   └── ui/
│       ├── icons/      # SVG care badge icons: IconSunLow, IconSunMedium, IconSunHigh, IconWaterLow, IconWaterMedium, IconWaterHigh
│       └── ...         # Button, Input, Modal, Drawer, Toast, Spinner, Skeleton, Badge, etc.
├── pages/              # Route-level page components
├── core/
│   ├── auth/           # AuthProvider, useAuth, authService
│   ├── cart/           # CartProvider, useCart, sessionId.ts (guest cart)
│   ├── wishlist/       # WishlistProvider, useWishlist
│   └── supabase.ts     # Supabase client instance
├── hooks/              # useProducts, useProduct, useServices, useCategories, useImageUpload, useDebounce, useScrollAnimation, etc.
├── lib/                # whatsapp.ts, formatters.ts, validators.ts, constants.ts, types.ts, fuzzyMatch.ts
├── styles/             # tokens.css + BEM component stylesheets
├── router.tsx
├── App.tsx
└── main.tsx
```

---

## Design System

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-forest` | `#1B4332` | Primary brand, headers, dark backgrounds |
| `--color-olive` | `#8BA740` | Accents, badges, active states |
| `--color-coral` | `#EF583D` | CTAs, WhatsApp buttons, highlights |
| `--color-sand` | `#F5F0E8` | Page backgrounds, cards |

### Typography

| Token | Value | Usage |
|---|---|---|
| `--font-ui` | `DM Sans, sans-serif` | All UI text, buttons, labels |
| `--font-editorial` | `Lora, serif` | Headings, scientific names, editorial copy |

### Spacing and Shape

- Base grid: 8px (`--space-2: 0.5rem`)
- Border radius: 12px (`--radius-md`)
- Approach: Mobile-first, with breakpoints at 640px, 1024px, and 1280px
- Styling: Custom CSS with BEM class naming — no utility frameworks

---

## Database

13 Supabase tables with Row-Level Security (RLS) enabled on all of them:

| Table | Description |
|---|---|
| `profiles` | Customer and admin user profiles, linked to `auth.users` |
| `categories` | Succulent categories with slugs and sort order |
| `products` | Succulents with pricing, images, care guide, stock, and category |
| `orders` | Customer orders with status tracking and WhatsApp flag |
| `order_items` | Line items per order with price snapshot |
| `cart_items` | Persistent cart for both guests (via `session_id`) and authenticated users (via `user_id`) |
| `wishlists` | Named wishlists per user |
| `wishlist_items` | Products saved to a wishlist |
| `services` | Service offerings (e.g. event arrangements) |
| `souvenir_packages` | Event souvenir bundles with pricing and minimums |
| `testimonials` | Customer reviews shown on landing page |
| `cms_content` | JSONB content blocks for editable landing/about sections |
| `proposals` | Curated featured collections with product arrays |

Auth uses Supabase email/password. Two roles: `admin` (Oscar — full CMS access) and `user` (customers — cart, wishlists, orders). Role is stored in `profiles.role`.

Guest cart rows use `session_id` (UUID v4 from `localStorage`) instead of `user_id`. All guest access goes through `SECURITY DEFINER` RPCs (`guest_cart_*`). On login, `merge_guest_cart(p_session_id)` moves guest items into the authenticated cart automatically.

Product and service photos are stored in the `greenlabs-images` Supabase Storage bucket (public read, admin write). The bucket is created by migration 006. Oscar uploads photos directly from `/admin/productos` and `/admin/servicios`.

---

## License

Private — All rights reserved. This codebase is proprietary to GREENLABS Botanics. Unauthorized use, distribution, or reproduction is prohibited.

---

## Built By

**Adrian Alexander** — Axiom Studio
