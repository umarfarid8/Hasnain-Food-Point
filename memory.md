# Memory — Hasnain Food Point

Living status file. The agent (and you) should update this **at the end of every session/task** — that's how a fresh Antigravity session picks up context cheaply instead of re-reading the whole codebase.

Last updated: 2026-08-22 (Secrets Audit Completed, appsettings.Production.json Gitignored & Untracked)

## Current Phase
`Phase 7 Complete — Secrets Audit Passed, Config Gitignored & MonsterASP.NET Ready`

## Completed
- [x] Phase 0 — Project Setup (incl. Capacitor Android shell)
- [x] Phase 1 — Backend: Menu & Settings API
- [x] Phase 2 — Frontend Skeleton & Layout
- [x] Phase 3 — Static Content Sections
- [x] Phase 4 — 3D & Animation Layer
- [x] Phase 5 — Low-Literacy & Performance Pass
- [x] Phase 6 — Deploy Backend & Build Signed APK
- [x] Android Bug Fixes & App Label: Handled native app intent handoff with `@capacitor/browser`, programmatic smooth scroll in WebView, and updated Android app name to `HFP`.
- [x] Phase 7 — Web Deploy, Admin Panel, SQL Server (MonsterASP.NET) & CORS Configuration:
  - Single-password admin authentication (JWT).
  - Price and availability update API (`PUT /api/admin/menu-items/{id}`).
  - Unlinked `/admin` portal on frontend.
  - SPA routing configs (`vercel.json`, `netlify.toml`, `public/_redirects`).
  - Added `public/robots.txt` disallowing `/admin` indexing.
  - Database Provider: Configured for **SQL Server** (`Microsoft.EntityFrameworkCore.SqlServer` with `EnableRetryOnFailure`) targeting MonsterASP.NET MSSQL instance.
  - Security & Secrets Audit:
    - Untracked `HasnainFoodPoint.Api/appsettings.Production.json` (`git rm --cached`) while preserving local file on disk.
    - Added `appsettings.Production.json`, `appsettings.*.local.json`, and `*.PublishSettings` to root `.gitignore`.
    - Added `HasnainFoodPoint.Api/appsettings.Production.json.example` template with generic placeholders.
    - Generated a cryptographically random 64-character (256-bit CSPRNG) JWT secret in local `appsettings.Production.json` replacing readable development placeholders.
    - Sanitized `hasnain-food-point-web/android/keystore.properties.example` with generic placeholder values.
    - Audited full git commit history (`git log -p --all`): verified **zero** real passwords, connection strings, or cloud secrets exist in git history.
  - Multi-stage .NET 8 `Dockerfile` created with non-root security and environment variable support.
  - Configured backend CORS policy to explicitly allow `https://hasnainfoodpoint.netlify.app` across `Program.cs`, `appsettings.json`, and `render.yaml`.
  - Fixed CORS middleware pipeline ordering: `app.UseRouting()` -> `app.UseCors("AllowFrontend")` -> `app.UseAuthentication()` -> `app.UseAuthorization()` -> `app.MapControllers()`.
  - Added explicit `[HttpOptions]` and `[EnableCors]` attributes to `AdminController`, `MenuController`, and `SettingsController`.
  - Verified live CORS preflight (`OPTIONS /api/admin/login`, `OPTIONS /api/admin/menu-items`) returns `204 No Content` with `Access-Control-Allow-Origin: https://hasnainfoodpoint.netlify.app`.
  - Verified that Android/Capacitor project was 100% untouched.

## File Currently Being Worked On
Live Deployment URLs & Endpoints:
1. **Live URLs**:
   - **Frontend Main Website**: `https://hasnainfoodpoint.netlify.app`
   - **Admin Portal**: `https://hasnainfoodpoint.netlify.app/admin`
   - **Backend API Base**: `https://hasnain-food-point-api.onrender.com` (or your MonsterASP domain)
   - **Live Swagger UI**: `https://hasnain-food-point-api.onrender.com/swagger` (or `https://your-site-name.monsterasp.net/swagger`)
   - **Health Check**: `https://hasnain-food-point-api.onrender.com/health`
2. **Config Untracking & Gitignore**:
   - Removed `HasnainFoodPoint.Api/appsettings.Production.json` from git tracking (`git rm --cached`) without touching the local file on disk.
   - Added `appsettings.Production.json`, `appsettings.*.local.json`, `appsettings.local.json`, `*.PublishSettings`, and `publish/` to root `.gitignore`.
   - Created `HasnainFoodPoint.Api/appsettings.Production.json.example` for reference.
3. **Production JWT Secret Hardening**:
   - Replaced readable development placeholder in local `appsettings.Production.json` with a newly generated, high-entropy 64-character (256-bit) cryptographically random hex key from CSPRNG.
4. **Secrets Audit (Current Repo & Full Git History)**:
   - Audited current working directory and all historical commits with regex searches (`Password`, `JwtSecret`, `DefaultConnection`, `Server=`, `User Id=`, `storePassword`).
   - Verified that `keystore.properties` is strictly ignored and untracked.
   - Sanitized `keystore.properties.example` to remove template password literals.
   - Confirmed that only SHA-256 one-way hashes (`PasswordHash`), dummy dev keys, or generic placeholder connection strings (`YOUR_MONSTERASP_SERVER`) exist in the repository and git history.
   - Sanitized `keystore.properties.example` to remove template password literals.
   - Confirmed that only SHA-256 one-way hashes (`PasswordHash`), dummy dev keys, or generic placeholder connection strings (`YOUR_MONSTERASP_SERVER`) exist in the repository and git history.
4. **MonsterASP.NET & SQL Server Configuration**:
   - Provider: `Microsoft.EntityFrameworkCore.SqlServer` configured with `EnableRetryOnFailure`.
   - Production connection string can be safely injected via environment variables or local `appsettings.Production.json`.

## Decisions Log
- `2026-08-22` — Security Audit, Gitignore Hardening & appsettings.Production.json Untracked:
  1. **Untracked Production Appsettings & Hardened JWT Secret**: Executed `git rm --cached` on `appsettings.Production.json`, added it to `.gitignore`, and populated it locally with a newly generated 64-character cryptographically random JWT secret (keeping secrets out of version control).
  2. **Audit Passed**: Confirmed no real passwords, live SQL Server connection strings, or JWT private keys are present anywhere in the repo or git log.
  3. **Sanitized Templates**: Replaced template values in `keystore.properties.example` with standard placeholders.
  1. **SQL Server DB Provider**: Configured `Program.cs` and configuration files to use `Microsoft.EntityFrameworkCore.SqlServer` with connection retry resiliency (`EnableRetryOnFailure`), connecting to MonsterASP.NET's MSSQL instance.
  2. **Pipeline Ordering Verified**: Confirmed strict middleware order `UseRouting() -> UseCors() -> UseAuthentication() -> UseAuthorization() -> MapControllers()`.
  3. **CORS Policy for Netlify**: Confirmed `https://hasnainfoodpoint.netlify.app` is allowed for all endpoints with full method and header support.
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
