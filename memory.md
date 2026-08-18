# Memory — Hasnain Food Point

Living status file. The agent (and you) should update this **at the end of every session/task** — that's how a fresh Antigravity session picks up context cheaply instead of re-reading the whole codebase.

Last updated: 2026-08-18 (Frontend Configured for Render Deployed Backend URL)

## Current Phase
`Phase 7 Complete — Frontend Wired to Live Render Backend & Web Deployment Ready`

## Completed
- [x] Phase 0 — Project Setup (incl. Capacitor Android shell)
- [x] Phase 1 — Backend: Menu & Settings API
- [x] Phase 2 — Frontend Skeleton & Layout
- [x] Phase 3 — Static Content Sections
- [x] Phase 4 — 3D & Animation Layer
- [x] Phase 5 — Low-Literacy & Performance Pass
- [x] Phase 6 — Deploy Backend & Build Signed APK
- [x] Android Bug Fixes & App Label: Handled native app intent handoff with `@capacitor/browser`, programmatic smooth scroll in WebView, and updated Android app name to `HFP`.
- [x] Phase 7 — Web Deploy, Admin Panel, SQLite Migration & Live API Configuration:
  - Single-password admin authentication (JWT).
  - Price and availability update API (`PUT /api/admin/menu-items/{id}`).
  - Unlinked `/admin` portal on frontend.
  - SPA routing configs (`vercel.json`, `netlify.toml`, `public/_redirects`).
  - Added `public/robots.txt` disallowing `/admin` indexing.
  - Switched database provider to SQLite (`Microsoft.EntityFrameworkCore.Sqlite`) for zero-cost, zero-setup production hosting on Render free tier.
  - Updated `Dockerfile` and `render.yaml` Blueprint for 1-click Dockerized Render deployment.
  - Wired frontend API base URL (`VITE_API_URL`) to `https://hasnain-food-point-api.onrender.com/api` across `.env`, `.env.production`, and `src/lib/api.js` for both public customer menu and admin management.
  - Verified that Android/Capacitor project was 100% untouched.

## File Currently Being Worked On
Completed Frontend API Configuration for Deployed Render Backend:
1. **API Base URL Environment Configuration**:
   - Updated `hasnain-food-point-web/.env` and `.env.production`: `VITE_API_URL=https://hasnain-food-point-api.onrender.com/api`.
   - Updated `hasnain-food-point-web/src/lib/api.js` default fallback to `https://hasnain-food-point-api.onrender.com/api`.
   - All customer hooks (`useMenu`, `useSettings`) and admin methods (`adminLogin`, `fetchAdminMenuItems`, `updateAdminMenuItem`) automatically use this deployed endpoint.
2. **Build Validation**:
   - Ran `npm run build` to package the production `dist/` bundle pointing to the live Render backend.
3. **Android / Capacitor Project Integrity**:
   - Confirmed `hasnain-food-point-web/android/` was **100% untouched**.

## Decisions Log
- `2026-08-18` — Wired Frontend to Deployed Render Backend URL:
  1. Configured `VITE_API_URL` to `https://hasnain-food-point-api.onrender.com/api` in `.env`, `.env.production`, and fallback in `src/lib/api.js`.
  2. Ensures both web build (Vercel/Netlify) and APK communicate with the cloud-hosted backend.

- `2026-08-18` — SQLite Migration & Render Free-Tier Blueprint:
  1. **SQLite Provider Selection**:
     - Switched production and local database to SQLite (`Microsoft.EntityFrameworkCore.Sqlite`) to enable 100% free hosting on Render with no external managed SQL Server required.
     - Auto-seeds business info and initial menu seamlessly upon container startup.
  2. **Render Blueprint (`render.yaml`)**:
     - Pre-configured environment variables for Docker web service on port 8080.
     - Health check configured at `/health`.

- `2026-08-18` — Completed Phase 7: Web Deploy & Admin Panel:
  1. **Single-Password Admin Auth Architecture**:
     - Scoped strictly to single-owner administration with no registration and no user tables.
     - Implemented `AdminAuthHelper` with SHA-256 constant-time comparison via `CryptographicOperations.FixedTimeEquals`.
     - Stored only SHA-256 hash (`PasswordHash`) — zero plaintext passwords in repo or docs.
  2. **Admin Menu Endpoints**:
     - `GET /api/admin/menu-items` returns full catalog including sold-out items.
     - `PUT /api/admin/menu-items/{id}` updates `Price` and `IsAvailable`.
  3. **Frontend Unlinked Admin Route (`/admin`) & robots.txt**:
     - Implemented `src/features/admin/AdminPage.jsx` mounted via pathname routing in `App.jsx`.
     - Added `public/robots.txt` disallowing search engines from indexing `/admin`.
  4. **Production Web Deployment Readiness**:
     - Added `vercel.json`, `netlify.toml`, and `public/_redirects` for automatic SPA routing to `/index.html`.
  5. **Android Project Untouched**:
     - Verified git status: `hasnain-food-point-web/android/` and release APK remained completely untouched.

- `2026-08-18` — Fixed Android APK Action Buttons & Updated App Label:
  - Fixed in-app smooth scroll and external link deep-linking with `@capacitor/browser`.
  - Updated app name to `HFP` and generated signed release APK (11.7 MB).

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
