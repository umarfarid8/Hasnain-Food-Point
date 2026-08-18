# Memory — Hasnain Food Point

Living status file. The agent (and you) should update this **at the end of every session/task** — that's how a fresh Antigravity session picks up context cheaply instead of re-reading the whole codebase.

Last updated: 2026-08-18 (Android APK Bug Fixes, App Label HFP & Signed Release Build)

## Current Phase
`Phase 6 Complete — Signed APK Released & Navigation Bug Fixed`

## Completed
- [x] Phase 0 — Project Setup (incl. Capacitor Android shell)
- [x] Phase 1 — Backend: Menu & Settings API
- [x] Phase 2 — Frontend Skeleton & Layout
- [x] Phase 3 — Static Content Sections
- [x] Phase 4 — 3D & Animation Layer
- [x] Phase 5 — Low-Literacy & Performance Pass
- [x] Phase 6 — Deploy Backend & Build Signed APK
- [x] Android Bug Fixes & App Label: Handled native app intent handoff with `@capacitor/browser`, programmatic smooth scroll in WebView, and updated Android app name to `HFP`.
- [ ] Phase 6.5 — Deploy Web Version (later, when desired)

## File Currently Being Worked On
Completed Android Bug Fixes & Signed Release Pipeline:
1. Fixed top bar and mobile drawer action buttons in Capacitor WebView using `@capacitor/browser` for external WhatsApp and Google Maps deep-linking, and `scrollToSection` for reliable in-page navigation without touch drops.
2. Updated Android app name and `title_activity_main` in `strings.xml` to `HFP`.
3. Ran `npm run build`, `npx cap sync android`, and `gradlew clean assembleRelease`.
4. Verified signed release APK generated at `hasnain-food-point-web/android/app/build/outputs/apk/release/app-release.apk` (11.7 MB, Scheme v2 verified).

## Decisions Log
- `2026-08-18` — Fixed Android APK Action Buttons & Updated App Label:
  1. **Action Buttons Bug Root Cause & Resolution**:
     - *In-App Navigation*: Single-page scroll layout (`#menu`, `#about`, `#location`). On mobile drawer, unmounting the drawer on tap caused Android WebView to swallow the default anchor navigation. Implemented `scrollToSection` in `src/lib/navigation.js` with `scrollIntoView({ behavior: 'smooth' })` and explicit event prevention.
     - *External Links (WhatsApp & Maps)*: Plain `<a href>` and `window.open` were blocked or trapped by Capacitor's WebView. Installed `@capacitor/browser` and created `openExternalUrl` to hand off to native Android app intents (WhatsApp / Google Maps / Chrome Custom Tabs) on native Android, while retaining `window.open(..., '_blank')` in browser dev testing.
     - Updated `Navbar.jsx`, `HeroScene.jsx`, `MenuItemCard.jsx`, `OwnerStory.jsx`, `LocationCard.jsx`, `WhatsAppFloatButton.jsx`, `Footer.jsx`, and `useWhatsAppLink.js`.
  2. **Android App Label**:
     - Updated `app_name` and `title_activity_main` in `hasnain-food-point-web/android/app/src/main/res/values/strings.xml` from `Hasnain Food Point` to `HFP`.
  3. **Signed Release Build Verification**:
     - Synced Capacitor plugin (`@capacitor/browser@8.0.4`) to Android.
     - Built signed release APK: `gradlew clean assembleRelease` (BUILD SUCCESSFUL in 4m 16s).
     - Verified APK signature via Android SDK `apksigner`: `Verified using v2 scheme (APK Signature Scheme v2): true`, 1 signer (`hasnain-release-key.jks`). Output: `hasnain-food-point-web/android/app/build/outputs/apk/release/app-release.apk` (11.7 MB).

- `2026-08-17` — Completed Phase 6: Backend Deployment & Signed APK Preparation:
  1. **Backend Deployment Config**:
     - Created optimized multi-stage `Dockerfile` and `.dockerignore` for .NET 8 ASP.NET Core Web API running on container port 8080.
     - Created `render.yaml` Blueprint for 1-click deployment on Render with environment variables and `/health` probe.
     - Added `appsettings.Production.json` with dynamic SQL Server ConnectionString and CORS origins.
     - Updated `Program.cs` with `ForwardedHeadersOptions` (for reverse proxies like Render/Azure), health check `/health` and root `/` status endpoints, and configurable CORS origins supporting `capacitor://localhost`, `http://localhost`, `https://localhost`.
  2. **Frontend Environment Wiring**:
     - Configured `.env.example` and `.env.production` (`VITE_API_URL=https://hasnain-food-point-api.onrender.com/api`).
     - Verified `api.js` timeout (4000ms), fallback to localhost in dev, and proper error handling.
  3. **Android App Icon & Splash Screen Assets**:
     - Generated Warm Ember brand assets (`#18181B` dark slate background with glowing amber flame & food emblem).
     - Generated launcher icons (`ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png`) across all densities (`mipmap-mdpi`, `mipmap-hdpi`, `mipmap-xhdpi`, `mipmap-xxhdpi`, `mipmap-xxxhdpi`).
     - Generated splash screens (`splash.png`) across all densities (`drawable-port-*`, `drawable-land-*`, and `drawable/splash.png`).
     - Configured `colors.xml`, `styles.xml`, and `ic_launcher_background.xml`.
  4. **Release Keystore & Signed APK Pipeline**:
     - Generated release keystore at: `keystore/hasnain-release-key.jks` with alias `hasnain-food-point` (strictly gitignored).
     - Configured `hasnain-food-point-web/android/keystore.properties` (strictly gitignored).
     - Updated `hasnain-food-point-web/android/app/build.gradle` to resolve `storeFile` via `rootProject.file(keystoreProperties['storeFile'])` and wire `signingConfig signingConfigs.release` to `buildTypes.release`.
  5. **Verification & Build Validation**:
     - Fixed duplicate resource collision by keeping `ic_launcher_background` exclusively in `ic_launcher_background.xml`.
     - Ran `gradlew clean` and `gradlew assembleRelease` (BUILD SUCCESSFUL).
     - Verified signed release APK generation at `hasnain-food-point-web/android/app/build/outputs/apk/release/app-release.apk` (11.6 MB).
     - Signature verified with Android SDK `apksigner`: `Verified using v2 scheme (APK Signature Scheme v2): true`, 1 signer. No passwords printed or committed.
- `2026-08-17` — Regenerated product placeholders with custom commercial food photography prompts matching authentic local recipes:
  1. **Amelet Burger**: Long hoagie-style sesame bun sliced lengthwise with fried egg omelette, grilled beef patty, tomato, lettuce, on rustic dark plate with warm amber side lighting and appetizing steam (`amelet-burger.webp`, 35 KB).
  2. **Aloo Naan**: Round tandoori naan flatbread with spiced mashed potato spread on top of the baked surface, chopped coriander, sesame seeds, golden charred edges (`aloo-naan.webp`, 58 KB).
  3. **Aloo Roll**: Small street-style finger-sized aloo roll with thin paratha tightly wrapped around spiced potato filling, no crispy fried shell (`aloo-roll.webp`, 27 KB).
  4. **Cold Drinks**: Kept existing placeholder slot without generating AI images — real beverage cooler/bottle photo needed from client.
  5. **Location Pin**: Integrated confirmed Google Maps link (`https://maps.app.goo.gl/pbYxzzyQbwvbU8897`) into frontend constants, backend seed data, and location card.
- `2026-08-16` — Completed Phase 5: Conducted comprehensive audit against PRD §3 (Target-User Design Implications) and rules.md (Performance & Low-Bandwidth Rules).
  1. **Image Optimization**: Optimized all public food and owner images with real WebP compression (quality 78%, max width 640–960px), reducing total image payload by **93.9% (from 19.2 MB raw assets down to 1.16 MB total, with individual card webp images ~38–46 KB)**.
  2. **Low-Literacy & Visual UI**: Trimmed wordy English descriptions into concise 3–5 word highlights; added emoji category visual navigation (🍟 Fries, 🍔 Burger, 🥟 Samosa, 🌯 Roll, 🫓 Naan, 🥤 Cold Drinks); added bilingual Urdu script & Roman-Urdu tags across all menu categories, item cards, hero highlights, and owner badges.
  3. **Tap Targets & High Contrast**: Guaranteed 44px+ minimum tap target across all interactive elements (including 3D/Photo toggle, category filter pills, menu card WhatsApp buttons, and direction buttons).
  4. **Throttled Network Resilience**: Removed duplicate preflight GET requests in `SplineHero.jsx`; enabled intelligent data-saver/mobile detection defaulting to static photo on 2G/3G/Save-Data/low-end devices; updated `api.js` timeout to 4000ms; and configured `useSettings` and `useMenu` with synchronous fallback rendering for instant 0ms FCP on slow connections.
  5. **Verification**: 0 linter errors (`oxlint`), clean production build (`vite build`), and verified responsive behavior on 375px mobile viewport in browser tests.
- `2026-08-16` — Completed Phase 4: Built `SplineHero` component with lazy loading (`React.lazy` + `Suspense`), separate code-split chunk, hardware WebGL capability check, `navigator.connection` save-data/2G check, `prefers-reduced-motion` compliance, preflight endpoint check, and React `ErrorBoundary` fallback ensuring static high-res photo (`hero-food.webp`) displays smoothly without breaking if WebGL/Spline fails.
- `2026-08-16` — Integrated Framer Motion animations across all sections: staggered entrance in `HeroScene`, scroll-triggered `whileInView` entrances (<400ms duration per design.md §5) in `MenuGrid`, `MenuItemCard`, `OwnerStory`, and `LocationCard`, smooth spring entrance and hover micro-interactions in `WhatsAppFloatButton`, and animated mobile drawer menu in `Navbar`.
- `2026-08-16` — Completed Phase 3: Built mobile-first static sections (`HeroScene`, `MenuGrid`, `MenuItemCard`, `OwnerStory`, `LocationCard`). Generated WebP/JPEG food placeholders, added category filter pills in `MenuGrid`, created `MenuItemCard` with WhatsApp deep-linking, added owner quote and trust highlights in `OwnerStory`, and built styled map card in `LocationCard`.
- `2026-08-16` — Completed Phase 2: Built single-page app shell, sticky `Navbar`, `Footer`, `WhatsAppFloatButton`, `Button`, `SectionHeading`, `useMenu`, `useSettings`, and `useWhatsAppLink` with Pakistani number normalization (`92...`).
- `2026-08-16` — Completed Phase 1: Implemented EF Core models, `AppDbContext`, migration, seed logic, DTOs, and controllers (`MenuController`, `SettingsController`).
- `2026-08-16` — Completed Phase 0: Scaffolded HasnainFoodPoint.Api and hasnain-food-point-web with Capacitor Android shell.

## Confirmed Client Content (seed this in Phase 1)
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
Draft story (simple language, tweak freely):
> "Hasnain Zafar started Hasnain Food Point right here in Sahiwal with one simple idea — serve fresh, honest food, made the way he'd want to eat it himself. What began as a small food point has become a daily stop for fries, rolls, and burgers made fresh to order. Every plate carries his name, so every plate gets his full attention."

**Location:** 94/9-L, Sahiwal
**Google Maps Pin:** https://maps.app.goo.gl/pbYxzzyQbwvbU8897
**Hours:** 12:00 PM – 9:00 PM, daily
**Logo/brand colors:** None exist — proceed with the "Warm Ember" palette in design.md.

## Known Placeholders / TODOs Still Needing Real Client Content
- [x] WhatsApp business number
- [x] Final menu items & prices
- [x] Google Maps location pin: https://maps.app.goo.gl/pbYxzzyQbwvbU8897
- [x] Owner name, photo, story text
- [x] Shop address, hours
- [x] Logo / brand colors — none exist, using design.md defaults
- [ ] Real product photos (fries, burger, samosa, roll, naan) — accurate AI placeholders active for dev
- [ ] Real Cold Drinks photo from client (no AI image generated)

## Items Needing Client Input
1. **Real food photography**: Provide final camera shots of dishes and cold drinks fridge before final public release.
2. **Urdu script / Punjabi phrasing preference**: Confirm if any specific local dialect adjustments are wanted.
3. **Cold Drinks pricing**: Confirm if individual drink sizes should be listed with fixed prices or remain "Ask on WhatsApp".

## Blockers / Open Questions
*(none currently — ready for Phase 6)*
