# Memory — Hasnain Food Point

Living status file. The agent (and you) should update this **at the end of every session/task** — that's how a fresh Antigravity session picks up context cheaply instead of re-reading the whole codebase.

Last updated: 2026-08-16 (Phase 5 completed)

## Current Phase
`Phase 6 — Deploy Backend & Build Signed APK` (ready to start)

## Completed
- [x] Phase 0 — Project Setup (incl. Capacitor Android shell)
- [x] Phase 1 — Backend: Menu & Settings API
- [x] Phase 2 — Frontend Skeleton & Layout
- [x] Phase 3 — Static Content Sections
- [x] Phase 4 — 3D & Animation Layer
- [x] Phase 5 — Low-Literacy & Performance Pass
- [ ] Phase 6 — Deploy Backend & Build Signed APK
- [ ] Phase 6.5 — Deploy Web Version (later, not blocking)

## File Currently Being Worked On
Completed Phase 5: Low-Literacy & Performance Pass across all frontend components (`SplineHero.jsx`, `MenuItemCard.jsx`, `MenuGrid.jsx`, `HeroScene.jsx`, `OwnerStory.jsx`, `LocationCard.jsx`, `api.js`, `useSettings.js`, `constants.js`, `tokens.css`, `tailwind.config.js`, `SeedData.cs`). Next: `Phase 6 — Deploy Backend & Build Signed APK`.

## Decisions Log
- `2026-08-16` — Completed Phase 5: Conducted comprehensive audit against PRD §3 (Target-User Design Implications) and rules.md (Performance & Low-Bandwidth Rules).
  1. **Image Optimization**: Optimized all public food and owner images with real WebP compression (quality 78%, max width 640–960px), reducing total image payload by **93.9% (from 19.2 MB raw assets down to 1.16 MB total, with individual card webp images ~38–46 KB)**.
  2. **Low-Literacy & Visual UI**: Trimmed wordy English descriptions into concise 3–5 word highlights; added emoji category visual navigation (🍟 Fries, 🍔 Burger, 🥟 Samosa, 🌯 Roll, 🫓 Naan, 🥤 Cold Drinks); added bilingual Urdu script & Roman-Urdu tags across all menu categories, item cards, hero highlights, and owner badges.
  3. **Tap Targets & High Contrast**: Guaranteed 44px+ minimum tap target across all interactive elements (including 3D/Photo toggle, category filter pills, menu card WhatsApp buttons, and direction buttons).
  4. **Throttled Network Resilience**: Removed duplicate preflight GET requests in `SplineHero.jsx`; enabled intelligent data-saver/mobile detection defaulting to static photo on 2G/3G/Save-Data/low-end devices; updated `api.js` timeout to 4000ms; and configured `useSettings` and `useMenu` with synchronous fallback rendering for instant 0ms FCP on slow connections.
  5. **Verification**: 0 linter errors (`oxlint`), clean production build (`vite build`), and verified responsive behavior on 375px mobile viewport in browser tests.
- `2026-08-16` — Completed Phase 4: Built `SplineHero` component with lazy loading (`React.lazy` + `Suspense`), separate code-split chunk, hardware WebGL capability check, `navigator.connection` save-data/2G check, `prefers-reduced-motion` compliance, preflight endpoint check, and React `ErrorBoundary` fallback ensuring static high-res photo (`hero-food.webp`) displays smoothly without breaking if WebGL/Spline fails.
- `2026-08-16` — Integrated Framer Motion animations across all sections: staggered entrance in `HeroScene`, scroll-triggered `whileInView` entrances (<400ms duration per design.md §5) in `MenuGrid`, `MenuItemCard`, `OwnerStory`, and `LocationCard`, smooth spring entrance and hover micro-interactions in `WhatsAppFloatButton`, and animated mobile drawer menu in `Navbar`.
- `2026-08-16` — Verified zero lint errors with `oxlint`, successful production bundle build (`vite build`), and clean mobile/desktop responsiveness in browser tests.
- `2026-08-16` — Completed Phase 3: Built mobile-first static sections (`HeroScene`, `MenuGrid`, `MenuItemCard`, `OwnerStory`, `LocationCard`). Generated high-quality WebP/JPEG food placeholders for all seeded menu items, copied client owner photo (`hasnain_owner.jpeg`) into public assets, implemented category filter pill navigation in `MenuGrid`, created photography-led `MenuItemCard` with direct WhatsApp deep-linking, added owner quote and trust highlights in `OwnerStory`, and built styled map and directions card in `LocationCard`.
- `2026-08-16` — Added `DEFAULT_MENU` fallback data in `constants.js` and wired into `useMenu.js` to ensure the frontend renders immediately even if the backend is slow or offline.
- `2026-08-16` — Completed Phase 2: Built single-page app shell, sticky `Navbar` with glassmorphic styling, `Footer`, `WhatsAppFloatButton` with authentic `#25D366` green and pulsing glow, `Button` UI component (with 44px+ tap target and variants), `SectionHeading` component, `useMenu` hook, `useSettings` hook, and `useWhatsAppLink` hook with automatic Pakistani phone number normalization (`92...` format) for deep-linking.
- `2026-08-16` — Implemented EF Core models (`Category`, `MenuItem`, `BusinessInfo`), `AppDbContext`, migration `InitialCreate`, seed logic `SeedData.cs`, DTOs, and controllers (`MenuController`, `SettingsController`). Seeded initial menu and business information in SQL Server LocalDB.
- `2026-08-16` — Scaffolded HasnainFoodPoint.Api (.NET 8 Web API, EF Core 8.0.11 SQL Server) and hasnain-food-point-web (React + Vite + Tailwind CSS + Capacitor 7 + Android platform) exactly matching architecture.md.
- `2026-08-16` — Chose Spline over hand-built Three.js models for the hero (see architecture.md §2).
- `2026-08-16` — Primary deliverable changed to an installable Android APK (not a website first). Chose Capacitor to wrap the already-planned React web app, over a separate .NET MAUI app, so the same codebase serves both APK now and web later (see architecture.md §8).
- `2026-08-16` — Admin panel (Phase 2.x) deferred — not building now, may revisit later if the client wants to self-edit the menu.
- `2026-08-16` — Product photos: none provided yet. Use Antigravity's built-in image generator for temporary placeholders only; must be replaced with real photos of the actual food before launch.

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

**Owner:** Hasnain Zafar. Photo provided (needs square/portrait crop for the About card).
Draft story (simple language, tweak freely):
> "Hasnain Zafar started Hasnain Food Point right here in Sahiwal with one simple idea — serve fresh, honest food, made the way he'd want to eat it himself. What began as a small food point has become a daily stop for fries, rolls, and burgers made fresh to order. Every plate carries his name, so every plate gets his full attention."

**Location:** 94/9-L, Sahiwal
**Hours:** 12:00 PM – 9:00 PM, daily
**Logo/brand colors:** None exist — proceed with the "Warm Ember" palette in design.md.

## Known Placeholders / TODOs Still Needing Real Client Content
- [x] WhatsApp business number
- [x] Final menu items & prices
- [ ] Real product photos (fries, burger, samosa, roll, naan) — placeholder AI images okay for dev only
- [x] Owner name, photo, story text
- [x] Shop address, hours
- [ ] Map link (Google Maps pin for 94/9-L, Sahiwal) — add when available
- [x] Logo / brand colors — none exist, using design.md defaults

## Items Needing Client Input (from Phase 5 audit)
1. **Real food photography**: Swap temporary AI-generated WebP photos with client's actual dish shots when available.
2. **Exact Google Maps location link**: Update with precise Google Maps Place ID / pin URL for 94/9-L, Sahiwal.
3. **Urdu script / Punjabi phrasing preference**: Confirm if the client wants any specific local dialect adjustments to the bilingual labels.
4. **Cold Drinks pricing**: Confirm if individual drink sizes should be split with fixed prices or kept as "Ask on WhatsApp".

## Blockers / Open Questions
*(none currently — ready for Phase 6)*
