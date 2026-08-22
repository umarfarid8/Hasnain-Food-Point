# Memory — Hasnain Food Point

Living status file. The agent (and you) should update this **at the end of every session/task** — that's how a fresh Antigravity session picks up context cheaply instead of re-reading the whole codebase.

Last updated: 2026-08-22 (Fixed CORS Preflight OPTIONS 404 & Middleware Pipeline Ordering)

## Current Phase
`Phase 7 Complete — CORS Preflight Pipeline Fixed (204 No Content Verified) & Render Ready`

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
  - Fixed CORS middleware pipeline ordering (`app.UseRouting()` before `app.UseCors()` before `app.UseAuthorization()`).
  - Added explicit `[HttpOptions]` and `[EnableCors]` attributes to `AdminController`, `MenuController`, and `SettingsController`.
  - Verified live CORS preflight (`OPTIONS /api/admin/login`, `OPTIONS /api/admin/menu-items`) returns `204 No Content` with `Access-Control-Allow-Origin: https://hasnainfoodpoint.netlify.app`.
  - Verified that Android/Capacitor project was 100% untouched.

## File Currently Being Worked On
Fixed CORS Preflight OPTIONS 404 Issue for Netlify Admin Access:
1. **Root Cause Diagnosis**:
   - In `HasnainFoodPoint.Api/Program.cs`, `app.UseRouting()` was omitted prior to `app.UseCors("AllowFrontend")`. In ASP.NET Core Endpoint Routing, CORS middleware must execute between `UseRouting` and `UseAuthentication`/`UseAuthorization`/`MapControllers` to evaluate endpoint metadata and short-circuit preflight requests before authorization challenges or controller routing.
   - Without `UseRouting()`, `OPTIONS /api/admin/login` fell through to controller routing which only accepted `POST`, triggering 404.
2. **Pipeline Reordering & Enhancements**:
   - Added explicit `app.UseRouting()` immediately preceding `app.UseCors("AllowFrontend")`.
   - Placed `app.UseCors("AllowFrontend")` before `app.UseAuthentication()` and `app.UseAuthorization()`.
   - Updated CORS policy to explicitly allow methods (`GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH`) and headers (`Authorization, Content-Type, Accept, Origin, X-Requested-With`).
   - Added `[EnableCors("AllowFrontend")]` attribute to `AdminController`, `MenuController`, and `SettingsController`.
   - Added explicit `[AllowAnonymous] [HttpOptions]` handler endpoints in `AdminController` for `/api/admin/login`, `/api/admin/menu-items`, and `/api/admin/menu-items/{id}` to guarantee 204 No Content even on non-standard/bare OPTIONS requests.
3. **Verification Results**:
   - `OPTIONS /api/admin/login` (with `Origin: https://hasnainfoodpoint.netlify.app`, `Access-Control-Request-Method: POST`) -> `204 No Content`
   - `OPTIONS /api/admin/login` (bare OPTIONS) -> `204 No Content`
   - `OPTIONS /api/admin/menu-items` (with `Access-Control-Request-Method: GET`, `Authorization` header) -> `204 No Content`
   - `OPTIONS /api/admin/menu-items/1` (with `Access-Control-Request-Method: PUT`) -> `204 No Content`
   - `POST /api/admin/login` -> returns `401 Unauthorized` with `Access-Control-Allow-Origin: https://hasnainfoodpoint.netlify.app` on invalid password, and `200 OK` + JWT token on valid password.

## Decisions Log
- `2026-08-22` — Fixed CORS Preflight Middleware Ordering & Added Explicit Options Handlers:
  1. **Middleware Pipeline**: Configured strict ASP.NET Core middleware ordering `UseRouting() -> UseCors("AllowFrontend") -> UseAuthentication() -> UseAuthorization() -> MapControllers()`.
  2. **Controller Hardening**: Added `[EnableCors]` attributes and `[HttpOptions]` methods in `AdminController` to eliminate preflight 404 errors completely.

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
