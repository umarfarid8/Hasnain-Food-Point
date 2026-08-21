# Memory — Hasnain Food Point

Living status file. The agent (and you) should update this **at the end of every session/task** — that's how a fresh Antigravity session picks up context cheaply instead of re-reading the whole codebase.

Last updated: 2026-08-21 (Backend Prepared & Verified for Render Deployment with SQLite & Netlify CORS)

## Current Phase
`Phase 7 Complete — Backend Deployment to Render Prepared & Verified (SQLite + Docker + Netlify CORS)`

## Completed
- [x] Phase 0 — Project Setup (incl. Capacitor Android shell)
- [x] Phase 1 — Backend: Menu & Settings API
- [x] Phase 2 — Frontend Skeleton & Layout
- [x] Phase 3 — Static Content Sections
- [x] Phase 4 — 3D & Animation Layer
- [x] Phase 5 — Low-Literacy & Performance Pass
- [x] Phase 6 — Deploy Backend & Build Signed APK
- [x] Android Bug Fixes & App Label: Handled native app intent handoff with `@capacitor/browser`, programmatic smooth scroll in WebView, and updated Android app name to `HFP`.
- [x] Phase 7 — Web Deploy, Admin Panel, SQLite Migration & CORS Configuration:
  - Single-password admin authentication (JWT).
  - Price and availability update API (`PUT /api/admin/menu-items/{id}`).
  - Unlinked `/admin` portal on frontend.
  - SPA routing configs (`vercel.json`, `netlify.toml`, `public/_redirects`).
  - Added `public/robots.txt` disallowing `/admin` indexing.
  - Switched database provider to SQLite (`Microsoft.EntityFrameworkCore.Sqlite`) for zero-cost, zero-setup production hosting on Render free tier.
  - Multi-stage .NET 8 `Dockerfile` created with non-root security and `/app/data` permission setup.
  - Configured `render.yaml` Blueprint for 1-click Dockerized Render deployment with health check at `/health`.
  - Configured backend CORS policy to explicitly allow `https://hasnainfoodpoint.netlify.app` across `Program.cs`, `appsettings.json`, `appsettings.Production.json`, and `render.yaml`.
  - Verified live CORS preflight (`OPTIONS`) and `GET` response with `Access-Control-Allow-Origin: https://hasnainfoodpoint.netlify.app`.
  - Verified that Android/Capacitor project was 100% untouched.

## File Currently Being Worked On
Backend Deployment Preparation & Verification for Render & Netlify Web Frontend:
1. **Frontend Environment Variable for Netlify**:
   - Variable Name: `VITE_API_URL`
   - Production Value: `https://hasnain-food-point-api.onrender.com/api`
   - Verified in `hasnain-food-point-web/src/lib/api.js`, `.env.example`, and `.env.production`.
   - Fallback in `src/lib/api.js`: `'https://hasnain-food-point-api.onrender.com/api'`.
2. **Database Provider (SQLite for Production)**:
   - Configured `HasnainFoodPoint.Api/Program.cs` to default to SQLite provider with automatic table generation and data seeding (`SeedData.InitializeAsync`).
   - Configured `appsettings.Production.json` and `appsettings.json` with `DatabaseProvider: Sqlite` and `ConnectionStrings:DefaultConnection: "Data Source=hasnain_food_point.db"`.
   - Tested EF Core startup on SQLite: verified automated schema initialization and initial seed data creation without external database dependencies.
3. **Docker & Render Configuration**:
   - `HasnainFoodPoint.Api/Dockerfile`: Multi-stage .NET 8 SDK build and ASP.NET 8 runtime image, listening on `http://+:8080`.
   - `render.yaml`: Web service blueprint with `runtime: docker`, `dockerfilePath: ./HasnainFoodPoint.Api/Dockerfile`, `dockerContext: ./HasnainFoodPoint.Api`, `healthCheckPath: /health`, and pre-populated production environment variables.
4. **CORS Whitelist Verification**:
   - Explicitly configured and verified `https://hasnainfoodpoint.netlify.app` in `Program.cs`, `appsettings.json`, `appsettings.Production.json`, and `render.yaml`.
   - Live HTTP preflight (`OPTIONS` and `GET`) tests confirmed `Access-Control-Allow-Origin: https://hasnainfoodpoint.netlify.app`, `Access-Control-Allow-Methods: GET, PUT`, and `Access-Control-Allow-Headers: Content-Type, Authorization`.
5. **Render Deployment Steps**:
   - **Option A (Blueprint)**: Connect repo in Render Dashboard -> New -> Blueprint -> Select repository (reads `render.yaml` automatically).
   - **Option B (Manual Web Service)**: New Web Service -> Docker runtime -> Root directory: `HasnainFoodPoint.Api` -> Dockerfile path: `Dockerfile` -> Port: `8080` -> Health check: `/health`.

## Decisions Log
- `2026-08-21` — Netlify Frontend Environment Variable & Render Deployment Readiness:
  1. **Frontend API URL Variable**: Identified and documented `VITE_API_URL` as the exact environment variable name required for Netlify builds (set to `https://hasnain-food-point-api.onrender.com/api`).
  2. **SQLite Database Provider**: Configured production backend to run EF Core SQLite out-of-the-box (`hasnain_food_point.db`), allowing zero-cost Render deployment without needing an external SQL Server instance.
  3. **Dockerfile & Blueprint**: Maintained production `Dockerfile` (multi-stage .NET 8) and `render.yaml` with Oregon region, free tier plan, health check at `/health`, and necessary ASP.NET Core environment variables (`ASPNETCORE_URLS=http://+:8080`, `DISABLE_HTTPS_REDIRECT=true`).
  4. **CORS Policy for Netlify**: Confirmed `https://hasnainfoodpoint.netlify.app` is whitelisted across all configuration levels and validated with live HTTP requests.

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
