# Memory — Hasnain Food Point

Living status file. The agent (and you) should update this **at the end of every session/task** — that's how a fresh Antigravity session picks up context cheaply instead of re-reading the whole codebase.

Last updated: 2026-08-18 (Phase 7 Complete — Web Deployment & Single-Password Admin Panel)

## Current Phase
`Phase 7 Complete — Web Deployment Configured & Admin Panel Live`

## Completed
- [x] Phase 0 — Project Setup (incl. Capacitor Android shell)
- [x] Phase 1 — Backend: Menu & Settings API
- [x] Phase 2 — Frontend Skeleton & Layout
- [x] Phase 3 — Static Content Sections
- [x] Phase 4 — 3D & Animation Layer
- [x] Phase 5 — Low-Literacy & Performance Pass
- [x] Phase 6 — Deploy Backend & Build Signed APK
- [x] Android Bug Fixes & App Label: Handled native app intent handoff with `@capacitor/browser`, programmatic smooth scroll in WebView, and updated Android app name to `HFP`.
- [x] Phase 7 — Web Deploy & Admin Panel: Single-password admin authentication (JWT), price/availability update API, unlinked `/admin` portal, SPA routing configs (`vercel.json`, `netlify.toml`, `public/_redirects`), and verification that Android/Capacitor remains untouched.

## File Currently Being Worked On
Completed Phase 7 (Web Deploy + Admin Panel):
1. **Backend Admin Auth & Menu Endpoints**:
   - `POST /api/admin/login`: Verifies single admin password using constant-time SHA-256 hash comparison against `AdminSettings:PasswordHash` (or `AdminSettings:Password`), issues short-lived JWT with `Admin` role.
   - `GET /api/admin/menu-items`: Protected with `[Authorize]`, returns all menu items (including sold-out/unavailable items) with category names for admin editing.
   - `PUT /api/admin/menu-items/{id}`: Protected with `[Authorize]`, updates item price and `isAvailable` status in the database with instant feedback.
2. **Frontend Admin Portal (`/admin`)**:
   - Built unlinked `AdminPage.jsx` route (completely isolated from customer UI).
   - Features password login card with error handling, session management, category filter pills, name search, editable price inputs, availability toggle switches (🟢 Available / 🔴 Sold Out), and per-row/batch Save buttons with animated success feedback.
3. **SPA Hosting & Deployment Configuration**:
   - Added `vercel.json`, `netlify.toml`, and `public/_redirects` to ensure zero-error SPA client routing across Vercel, Netlify, or any static host.
   - Verified that customer single-page experience remains pristine and completely unlinked from admin paths.
4. **Android / Capacitor Project Integrity**:
   - Confirmed `hasnain-food-point-web/android/` was **100% untouched** — no APK rebuild was required.

## Decisions Log
- `2026-08-18` — Completed Phase 7: Web Deploy & Admin Panel:
  1. **Single-Password Admin Auth Architecture**:
     - Scoped strictly to single-owner administration with no registration and no user tables per PRD §6 & Phase 7 spec.
     - Implemented `AdminAuthHelper` with PBKDF2/SHA-256 hashing and constant-time comparison via `CryptographicOperations.FixedTimeEquals`.
     - Added `Microsoft.AspNetCore.Authentication.JwtBearer` (8.0.11) with symmetric key validation, issuer/audience enforcement, and Swagger UI Bearer token integration.
     - Added `AdminSettings` in `appsettings.json` and `appsettings.Production.json` with SHA-256 hash (`PasswordHash`) — no plaintext passwords stored in repo or config.
  2. **Admin Menu Endpoints**:
     - `GET /api/admin/menu-items` returns full catalog including sold-out items.
     - `PUT /api/admin/menu-items/{id}` updates `Price` and `IsAvailable`, recalculating `PriceDisplay` accordingly.
  3. **Frontend Unlinked Admin Route (`/admin`) & robots.txt**:
     - Implemented in `src/features/admin/AdminPage.jsx` and mounted via lightweight pathname routing in `App.jsx`.
     - Zero admin links in public header, navbar, footer, or cards.
     - Added `public/robots.txt` disallowing search engine crawlers from indexing `/admin`.
     - Full interactive testing verified with Browser Subagent: tested invalid password rejection (401), valid login (200), item toggle to "Sold Out" (item dynamically hid on consumer menu), item toggle back to "Available", and session logout.
  4. **Production Web Deployment Readiness**:
     - Added `vercel.json`, `netlify.toml`, and `public/_redirects` for automatic SPA routing to `/index.html`.
     - Deployed clean production build `npm run build` (0 lint errors, 0 compiler warnings).
  5. **Android Project Untouched**:
     - Verified git status: `hasnain-food-point-web/android/` and release APK `app-release.apk` remained completely untouched.

- `2026-08-18` — Fixed Android APK Action Buttons & Updated App Label:
  1. **Action Buttons Bug Root Cause & Resolution**:
     - *In-App Navigation*: Single-page scroll layout (`#menu`, `#about`, `#location`). Implemented `scrollToSection` in `src/lib/navigation.js` with `scrollIntoView({ behavior: 'smooth' })`.
     - *External Links (WhatsApp & Maps)*: Handled via `@capacitor/browser` and `openExternalUrl` for native Android app intents.
  2. **Android App Label**:
     - Updated `app_name` and `title_activity_main` in `strings.xml` to `HFP`.
  3. **Signed Release Build Verification**:
     - Verified signed release APK generated at `hasnain-food-point-web/android/app/build/outputs/apk/release/app-release.apk` (11.7 MB, Scheme v2 verified).

- `2026-08-17` — Completed Phase 6: Backend Deployment & Signed APK Preparation:
  1. **Backend Deployment Config**: Dockerfile, `render.yaml`, `appsettings.Production.json`, CORS policies.
  2. **Frontend Environment Wiring**: `VITE_API_URL` environment configuration and fallback resilience.
  3. **Android Brand Assets & Keystore**: Keystore setup, app icons, splash screens.

## Confirmed Client Content
**WhatsApp number:** 0305 1589494

**Menu:**
| Category | Item | Price |
|---|---|---|
| Fries | Half Plate | Rs. 50 |
| Fries | Full Plate | Rs. 100 |
| Burger | Amelet Burger | Rs. 150 |
| Samosa | Aloo Samosa | Rs. 30 |
| Roll | Aloo Roll | Rs. 10 |
| Naan | Aloo Naan | Rs. 70 |
| Cold Drinks & Juices | Gourmet, Coke, Pepsi | Price varies — show "Ask on WhatsApp" instead of a fixed price |

**Owner:** Hasnain Zafar. Photo provided (cropped & compressed in assets).
**Location:** 94/9-L, Sahiwal
**Google Maps Pin:** https://maps.app.goo.gl/pbYxzzyQbwvbU8897
**Hours:** 12:00 PM – 9:00 PM, daily
**Logo/brand colors:** Warm Ember palette.

## Known Placeholders / TODOs Still Needing Real Client Content
- [x] WhatsApp business number
- [x] Final menu items & prices
- [x] Google Maps location pin: https://maps.app.goo.gl/pbYxzzyQbwvbU8897
- [x] Owner name, photo, story text
- [x] Shop address, hours
- [x] Logo / brand colors — using design.md Warm Ember defaults
- [ ] Real product photos (fries, burger, samosa, roll, naan) — accurate AI placeholders active for dev
- [ ] Real Cold Drinks photo from client (no AI image generated)

## Items Needing Client Input
1. **Real food photography**: Provide final camera shots of dishes and cold drinks fridge before final public release.
2. **Urdu script / Punjabi phrasing preference**: Confirm if any specific local dialect adjustments are wanted.
3. **Cold Drinks pricing**: Confirm if individual drink sizes should be listed with fixed prices or remain "Ask on WhatsApp".
