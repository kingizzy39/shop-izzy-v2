# CLAUDE Memory — shop-izzy-v2

> Updated: 2026-09-27

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
- **TypeScript strict mode** — no errors
- **Dev server no-cache headers** — aggressive cache-busting in development: `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`, `Pragma: no-cache`, `Expires: 0`, `Surrogate-Control: no-store` on ALL responses (HTML, JS, CSS, assets, Vite client, HMR)
- **Auto cache clear on dev start** — `predev` script runs `rm -rf node_modules/.vite` before Vite starts
- **LAN accessible** — server binds to `0.0.0.0:3001`, works from other devices on network
- **Test suite (Vitest + React Testing Library)** — 49 tests passing covering store (cart, auth), Header component, Cart component; TypeScript strict mode clean, ESLint clean, build passes

---

## 4. What Didn't Work

- **Tailwind v4 `@theme`/`@utility` not compiling in production** — missing `postcss.config.js` with `@tailwindcss/postcss` plugin
- **Pseudo-classes in `@utility`** (`btn-primary:hover`, `input-premium:focus`, etc.) — Tailwind v4 doesn't support them; must use regular CSS
- **Playfair Display font not loading** — missing Google Fonts import
- **Missing favicon** — 404 on `/favicon.svg`
- **Cart/Checkout/Seller pages** — only placeholders
- **No tests** — `npm test` exits with error

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

## 6. Open Threads

- [x] Fix Tailwind v4 design system compilation (PostCSS config)
- [x] Load Playfair Display font
- [x] Add favicon
- [x] Implement Cart page — connect to Zustand cart, show items, quantities, totals, checkout link
- [x] Implement Checkout page — shipping, payment, order confirmation (with OrderSuccess page)
- [x] Implement image solution — curated Unsplash photos + SVG fallbacks (all products have images)
- [x] Fix Unsplash image URLs — corrected buildUnsplashUrl, verified all 55 product photos + category fallbacks return 200
- [x] Implement Seller Join page — 5-step onboarding form (Business Info, Personal Info, Bank Details, Verification, Review)
- [x] Implement Seller Login page — email/password authentication with mock login
- [x] Implement Seller Dashboard — Overview (stats, recent orders), Products (CRUD with modal), Orders (table with status), Settings (business info, bank details)
- [x] Fix authentication flow — proper redirects with `from` location state for shopper/seller signup & login, session persistence on reload
- [x] Unified auth page (AuthPage.jsx) — single page with Sign Up/Sign In tabs, seller join link, proper redirects
- [x] Dev server cache-busting — no-cache headers + auto cache clear on `npm run dev` (for localhost + LAN)
- [x] Test suite (Vitest + React Testing Library) — 49 tests passing (store: cart, auth; components: Header, Cart)
- [x] Add pagination to CategoryListing — fully implemented with URL-synced state, accessible ellipsis navigation, 12 products per page
- [x] Add search functionality — SearchResults page with URL-synced query, filters, sorting, and pagination; Header search forms (desktop + mobile) navigate to /search?q=
- [ ] Consider API layer / backend integration (currently all mock data)

---

_Update this file at the end of each session. Overwrite outdated sections rather than appending._
