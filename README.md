# HITHAM — House Of Organic Foods

A single Next.js 16 application containing both the **customer storefront** and the **admin panel** for HITHAM. Built with TypeScript, Tailwind CSS v4, and Firebase (Firestore + Storage + Auth) — no custom backend server. Payments run through Razorpay, with three small server routes that exist only because Razorpay's security model requires them (see below).

## What's included

### Storefront (`/`)
- **Home** — hero, featured products, goal-based browsing, testimonials.
- **Products** (`/products`) — catalog with category filter and search; detail page with gallery, quantity, add-to-cart.
- **Cart** (`/cart`) — persisted in `localStorage` for guests, quantity controls, subtotal.
- **Checkout** (`/checkout`) — shipping address, Razorpay payment, order written to Firestore on verified success.
- **Subscriptions** (`/subscriptions`) — weekly/monthly/quarterly plans; subscribing also goes through Razorpay.
- **Recommendations** (`/recommendations`) — the AI health-recommendation engine: age/weight/height/activity/condition in, BMI + calorie/macro targets + meal schedule + matched products and plans out. Pure frontend logic (`src/lib/site/recommendations.ts`), no backend.
- **Journal** (`/blog`) — articles published from the admin CMS.
- **Auth** (`/login`, `/signup`, `/forgot-password`) — Firebase Auth: Google + email/password + password reset.
- **Account** (`/account`, `/account/orders`, `/account/subscriptions`) — profile editing, order history, active subscriptions. Gated client-side by `RequireAuth`.

### Admin panel (`/admin`)
Everything from the original build: dashboard analytics, Products, Subscriptions, Orders, Users, Blogs, Testimonials — see the sections further down for details. Gated by a shared password (`ADMIN_PASSWORD`), unrelated to customer Firebase Auth.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Firebase, ADMIN_PASSWORD, and Razorpay keys
npm run dev
```

Visit `http://localhost:3000` for the storefront, `http://localhost:3000/admin` for the admin panel.

## Razorpay integration — why three API routes exist

The architecture brief asked for no backend server, and the admin panel and most of the storefront genuinely have none — every data operation is a direct Firebase SDK call from the browser. Payments are the one exception, and it's not optional: **Razorpay's `key_secret` must never reach the browser**, and verifying a payment signature requires that secret. So there are exactly three thin server routes, each doing only what Razorpay's own security model requires, nothing else:

- `src/app/api/razorpay/create-order` — creates a Razorpay order server-side (the amount must be set authoritatively by the server; trusting a client-supplied amount would let anyone pay ₹1 for anything).
- `src/app/api/razorpay/verify-payment` — verifies the HMAC-SHA256 signature Razorpay returns after checkout, using `RAZORPAY_KEY_SECRET`. This confirms the payment response wasn't tampered with client-side.
- `src/app/api/razorpay/webhook` — Razorpay calling **your** server directly to confirm a payment settled, independent of whether the customer's browser stayed open. Configure this URL in Razorpay Dashboard → Settings → Webhooks. It currently verifies and logs; wire it to update Firestore once you've picked an admin-write security model (see below) — that's marked with a `TODO` in the file.

Client-side checkout flow lives in `src/lib/site/razorpay-client.ts`, which loads `checkout.js`, calls `create-order`, opens the Razorpay widget, and calls `verify-payment` on success before the order is written to Firestore.

## ⚠️ Read this before deploying: how writes are secured

This is unchanged from the admin-only build, but now applies to the storefront too, since it also writes to Firestore (orders, subscriptions, profile updates, payments).

**No password screen or login flow — admin or customer — by itself protects your Firestore data.** `firestore.rules` and `storage.rules` are the only real security boundary; anyone with your `NEXT_PUBLIC_FIREBASE_*` config (which is public in the browser bundle by design) can call the Firestore SDK directly and do whatever your rules allow.

The rules in this repo currently reflect two different postures depending on what you set them to:
- **Customer-owned data** (`orders`, `userSubscriptions`, `payments`, their own `users/{uid}` doc) is scoped with `request.auth.uid` checks — a signed-in customer can only read/write their own records. This is real security, not a placeholder, as long as you keep Firebase Auth wired the way it is.
- **Admin-managed content** (`products`, `subscriptionPlans`, `blogs`, `testimonials`) has no equivalent boundary, because the admin panel's password gate lives in Next.js (`src/proxy.ts`), not in Firebase. If you opened these up to `allow write: if true` for local development (as the conversation that built this did), that is genuinely open to the public internet and must be locked down with Firebase Auth custom claims or a server-side write layer — see the original admin README section for the two real options — before any of this touches production traffic.

## Architecture notes

- `src/lib/firebase.ts` — single Firebase client SDK instance. `auth` is initialized **lazily** behind a `Proxy`, not at module load — `getAuth()` can throw during Next.js's server-side prerendering of `"use client"` pages before real env vars are guaranteed to be available, so construction is deferred until something actually calls an auth method in the browser.
- `src/lib/site/*` — storefront-facing Firestore/Auth/Razorpay logic, mirroring the `src/lib/services/*` pattern used by the admin panel but scoped to what a customer (not an admin) needs.
- `src/components/site/cart/cart-context.tsx` — cart state in React context, persisted to `localStorage`. Hydration is deferred via `queueMicrotask` so the initial render doesn't synchronously setState from an effect (avoids React's cascading-render warning, and is genuinely correct: the first paint should show an empty cart before storage is read, not block on it).
- `src/components/site/auth/auth-context.tsx` — wraps Firebase `onAuthStateChanged` and a live Firestore subscription to the matching `users/{uid}` profile doc.
- `src/components/site/account/require-auth.tsx` — client-side redirect guard for `/account/*`. Not a security boundary (that's Firestore rules) — purely a UX redirect so signed-out visitors land on `/login` instead of an empty page.
- The recommendation engine (`src/lib/site/recommendations.ts`) uses Mifflin-St Jeor for BMR as a reasonable estimate, scaled by activity level and nudged toward the stated goal. It's labeled as general guidance, not medical advice, in the UI itself — this matters because it's giving numeric health output.

## Architecture notes

- `src/lib/firebase.ts` — single Firebase client SDK instance. `auth` is initialized **lazily** behind a `Proxy`, not at module load — `getAuth()` can throw during Next.js's server-side prerendering of `"use client"` pages before real env vars are guaranteed to be available, so construction is deferred until something actually calls an auth method in the browser.
- `src/lib/site/*` — storefront-facing Firestore/Auth/Razorpay logic, mirroring the `src/lib/services/*` pattern used by the admin panel but scoped to what a customer (not an admin) needs.
- `src/lib/services/*` — admin-facing CRUD, one file per collection, plain async functions calling the Firebase SDK directly. No API routes for data.
- `src/lib/storage.ts` — image upload/delete helpers for Firebase Storage, organized by folder (`products/`, `blogs/`, `testimonials/`, etc.), used by both the admin panel and storefront.
- `src/components/site/cart/cart-context.tsx` — cart state in React context, persisted to `localStorage`. Hydration is deferred via `queueMicrotask` so the initial render doesn't synchronously setState from an effect (avoids React's cascading-render warning, and is genuinely correct: the first paint should show an empty cart before storage is read, not block on it).
- `src/components/site/auth/auth-context.tsx` — wraps Firebase `onAuthStateChanged` and a live Firestore subscription to the matching `users/{uid}` profile doc.
- `src/components/site/account/require-auth.tsx` — client-side redirect guard for `/account/*`. Not a security boundary (that's Firestore rules) — purely a UX redirect so signed-out visitors land on `/login` instead of an empty page.
- `src/proxy.ts` — Next.js 16's request-interception layer (the renamed `middleware.ts`). Redirects unauthenticated requests to `/admin/*` to `/admin/login`. Has no effect on the storefront, which uses Firebase Auth instead.
- `src/app/api/admin-login`, `src/app/api/admin-logout` — exist solely to set/clear an httpOnly cookie for the admin password gate, which client-side JavaScript cannot do safely. No business logic.
- The recommendation engine (`src/lib/site/recommendations.ts`) uses Mifflin-St Jeor for BMR as a reasonable estimate, scaled by activity level and nudged toward the stated goal. It's labeled as general guidance, not medical advice, in the UI itself — this matters because it's giving numeric health output.
- Dashboard analytics (`src/lib/services/dashboard.ts`) pull all orders/users/products/subscriptions client-side and aggregate in-browser. Fine at this scale; if order volume grows into the tens of thousands, consider precomputing aggregates with a scheduled Cloud Function instead of reading the whole collection on every dashboard load.

## Known placeholders

- `ADMIN_PASSWORD` ships unset in `.env.example` — you must set it.
- Firestore composite indexes: several storefront and admin queries combine `where(...)` with `orderBy(...)`, which Firestore needs a composite index for. The first time you run a query like this against a real project, Firestore's error message includes a direct link to create the exact index needed — click it.
- The Razorpay webhook handler verifies and logs but doesn't yet update Firestore — intentional, pending the admin-write security decision above.
- Recommendation engine's product matching does simple substring matching against product `benefits` text. It works for the seeded demo data; if you want better matching as the catalog grows, consider tagging products with explicit `diseaseType` fields rather than relying on free-text benefit strings.

#   h i t h a m _ w e b s i t e  
 