# CLAUDE Memory — shop-izzy-v2

> Updated: 2026-09-29 (Session 3: Fixed Product Image Mapping, ScrollToTop Verification, Shop Blank Screen on Auth Redirect)

---

## 1. Environment

- **Platform**: Linux 6.17.0 (proot-distro Ubuntu on Android/Termux)
- **Editor**: code-server (VS Code in browser)
- **Shell**: bash
- **Node**: Available (project uses Vite + TypeScript)
- **Package manager**: npm (package-lock.json present)
- **Git**: Repository initialized, on `master` branch (main branch is `main`)

---

## 2. Project Type & Architecture

- **Product**: E-commerce frontend ("shop-izzy-v2")
- **Stack**: Vite + React 19 + TypeScript + Tailwind CSS v4 + Zustand + React Router v7
- **Structure**:
  - `src/` — application source
  - `public/` — static assets
  - `dist/` — build output
  - `docs/` — documentation
  - `reference/` — reference materials
- **Config**: ESLint, TypeScript (strict), Vite, Husky (git hooks), PostCSS (added)
- **State**: Zustand with persist middleware (cart, wishlist, products, categories, seller, reviews)

---

## 3. What Worked

- **Design system tokens in CSS** (`@theme` with custom colors, spacing, typography, shadows, transitions, gradients) — now compiling via PostCSS
- **Custom utilities** (`@utility` for buttons, cards, inputs, animations, gradients, containers) — working in production build
- **Component architecture** — clean separation: routes, components, hooks, store, data
- **Category listing page** — full filtering (category, price range, rating, stock), sorting, URL-synced state, **pagination (12 products/page with accessible ellipsis navigation)**
- **Search functionality** — SearchResults page with query in URL (`/search?q=`), filters, sorting, pagination; Header search forms (desktop + mobile) with form submission
- **Product detail page** — image gallery, color swatches (fashion), connectivity (electronics), tabs (Description/Specs/Reviews), review system, related products
- **Home page** — hero, category tiles, featured sections, seller spotlight, CTA
- **Mock data** — 55 products across 6 categories with Nigerian Naira pricing
- **Dev server no-cache headers** — aggressive cache-busting in development: `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`, `Pragma: no-cache`, `Expires: 0`, `Surrogate-Control: no-store` on ALL responses (HTML, JS, CSS, assets, Vite client, HMR)
- **Auto cache clear on dev start** — `predev` script runs `rm -rf node_modules/.vite` before Vite starts
- **LAN accessible** — server binds to `0.0.0.0:3001`, works from other devices on network
- **Test suite (Vitest + React Testing Library)** — 49 tests passing covering store (cart, auth), Header component, Cart component
- **Design system compliance** — 60% cream/beige backgrounds, 30% black structural text, 10% gold-amber gradient accents ✅
- **Playfair Display font** — loaded via Google Fonts in both `index.html` and `public/index.html`
- **Favicon** — created in `public/favicon.svg`
- **Authentication flow** — proper redirects with `from` location state for shopper/seller
- **Unified auth page** (`AuthPage.jsx`) — single page with Sign Up/Sign In tabs, seller join link
- **Seller Join** — 5-step onboarding form
- **Seller Dashboard** — Overview, Products (CRUD), Orders, Settings
- **Cart, Checkout, OrderSuccess** — fully implemented with Zustand persist
- **Wishlist page** — fully implemented with add to cart, remove, clear wishlist confirmation modal
- **Footer links** — all 13 placeholder links replaced with real routes (/about, /careers, /press, /sustainability, /help, /returns, /contact, /faqs, /privacy, /terms, /cookies, /accessibility)
- **Social links** — updated to real URLs (Instagram, Twitter, Facebook, YouTube)
- **Newsletter form** — functional with loading state, success message, email capture
- **Info pages** — reusable InfoPage component for all footer informational routes
- **Code-splitting** — React.lazy + Suspense on all routes, main bundle ~945KB with 20 route chunks
- **Removed dead code** — deleted unused API layer, MSW mocks, duplicate route files (SellerDashboard.jsx, SellerJoin.jsx, LoginPage.jsx, SignupPage.jsx)
- **Product image fallback chain** — reordered to prioritize Unsplash (reliable CDN) over LoremFlickr (unreliable), local SVG placeholders as guaranteed fallback
- **ScrollToTop on route change** — verified working: `src/components/ScrollToTop.jsx` mounted in App.tsx, scrolls to top instantly on pathname/hash change
- **Shop page blank screen fix** — added hydration wait (`hasHydrated`), loading spinner, auth safety check in Home.tsx to prevent blank screen after sign-up redirect

---

## 4. What Didn't Work (Current Blockers)

- **Seller product image upload** — fake file input, no actual upload implementation

---

## 5. Adaptations

- **Fixed Tailwind v4 build** — added `postcss.config.js`, moved pseudo-classes to regular CSS in `index.css`
- **Added Google Fonts preconnect + import** for Playfair Display in both `index.html` and `public/index.html`
- **Created favicon.svg** in `public/`
- **Dev server on port 3001** (auto-selected by Vite) — accessible at http://localhost:3001/
- **Dev server cache-busting** — added no-cache middleware in `vite.config.ts` (dev-only plugin + server.headers) + `predev` script in `package.json` to wipe `node_modules/.vite` on every `npm run dev`
- **Authentication flow fixed** — proper redirects with `from` location state:
  - Shopper signup/login → `/shop` (main marketplace)
  - Seller join/login → `/seller/dashboard`
  - Session persists on reload via localStorage (Zustand persist)
  - Protected routes save `from` location for post-login redirect
  - LandingPage uses React Router navigate (no full reload)
- **Unified auth page** (`AuthPage.jsx`) — single page with Sign Up / Sign In tabs:
  - `/login` and `/signup` both render `AuthPage` (defaults to Sign Up tab)
  - Sign Up tab has "Join as Seller" link → `/seller/join` → Seller Dashboard
  - Landing page CTAs point to `/signup` (shows signup form first)

---

## 6. Open Threads (Prioritized Fix List)

### P0 — Blocking (Must Fix Before Any Build)

- [x] Fix TypeScript build errors in `src/api/client.ts`, `src/api/hooks.ts`, `src/mocks/handlers.ts` — **DONE** (API layer removed)
- [x] Fix 9 ESLint errors (unused imports, unused params) — **DONE** (API layer removed)

### P1 — High (Architecture Decision Required)

- [x] **Decide on API layer fate**: **REMOVED** — deleted `src/api/`, `src/mocks/` — app works fully with Zustand + `src/data.ts`

### P1 — High (Config)

- [x] Add `.env.example` with all required environment variables — **DONE**

### P2 — Medium (Feature Completeness)

- [x] Replace `loremflickr.com` fallback with reliable source — **DONE** (reordered fallback chain: Unsplash primary → LoremFlickr secondary → local SVG guaranteed)
- [ ] Implement real seller product image upload (or document as mock)

### P3 — Low (Polish)

- [x] Replace footer `#` links with real pages — **DONE** (12 new InfoPage routes created)
- [x] Replace social media `#` links — **DONE** (real URLs added)
- [x] Add newsletter backend integration or remove form — **DONE** (functional form with success state)

### Completed (Reference)

- [x] Fix Tailwind v4 design system compilation (PostCSS config)
- [x] Load Playfair Display font
- [x] Add favicon
- [x] Implement Cart page — connect to Zustand cart, show items, quantities, totals, checkout link
- [x] Implement Checkout page — shipping, payment, order confirmation (with OrderSuccess page)
- [x] Implement image solution — curated Unsplash photos + SVG fallbacks (all products have images)
- [x] Fix Unsplash image URLs — corrected buildUnsplashUrl, verified all 55 product photos + category fallbacks return 200
- [x] **Reorder image fallback chain** — Unsplash primary (reliable CDN) → LoremFlickr secondary → local SVG guaranteed fallback
- [x] **Verify ScrollToTop on route change** — already implemented in ScrollToTop.jsx, mounted in App.tsx
- [x] **Fix shop page blank screen after auth redirect** — added hydration wait, loading state, auth safety check in Home.tsx
- [x] Implement Seller Join page — 5-step onboarding form (Business Info, Personal Info, Bank Details, Verification, Review)
- [x] Implement Seller Login page — email/password authentication with mock login
- [x] Implement Seller Dashboard — Overview (stats, recent orders), Products (CRUD with modal), Orders (table with status), Settings (business info, bank details)
- [x] Fix authentication flow — proper redirects with `from` location state for shopper/seller signup & login, session persistence on reload
- [x] Unified auth page (AuthPage.jsx) — single page with Sign Up/Sign In tabs, seller join link, proper redirects
- [x] Dev server cache-busting — no-cache headers + auto cache clear on `npm run dev` (for localhost + LAN)
- [x] Test suite (Vitest + React Testing Library) — 49 tests passing (store: cart, auth; components: Header, Cart)
- [x] Add pagination to CategoryListing — fully implemented with URL-synced state, accessible ellipsis navigation, 12 products per page
- [x] Add search functionality — SearchResults page with URL-synced query, filters, sorting, and pagination; Header search forms (desktop + mobile) navigate to /search?q=
- [x] Implement Wishlist page — full CRUD with add to cart, remove, clear with confirmation modal
- [x] Remove duplicate route files — deleted SellerDashboard.jsx, SellerJoin.jsx, LoginPage.jsx, SignupPage.jsx
- [x] Code-split all routes — React.lazy + Suspense, 20 route chunks, main bundle ~945KB

---

_Update this file at the end of each session. Overwrite outdated sections rather than appending._
