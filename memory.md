# Memory — Hasnain Food Point

Living status file. The agent (and you) should update this **at the end of every session/task** — that's how a fresh Antigravity session picks up context cheaply instead of re-reading the whole codebase.

Last updated: 2026-08-16 (Phase 3 completed)

## Current Phase
`Phase 4 — 3D & Animation Layer` (ready to start)

## Completed
- [x] Phase 0 — Project Setup (incl. Capacitor Android shell)
- [x] Phase 1 — Backend: Menu & Settings API
- [x] Phase 2 — Frontend Skeleton & Layout
- [x] Phase 3 — Static Content Sections
- [ ] Phase 4 — 3D & Animation Layer
- [ ] Phase 5 — Low-Literacy & Performance Pass
- [ ] Phase 6 — Deploy Backend & Build Signed APK
- [ ] Phase 6.5 — Deploy Web Version (later, not blocking)

## File Currently Being Worked On
Completed Phase 3 static content sections (`HeroScene.jsx`, `MenuGrid.jsx`, `MenuItemCard.jsx`, `OwnerStory.jsx`, `LocationCard.jsx`). Next: `Phase 4 — 3D & Animation Layer` (`Spline` 3D hero integration, Framer Motion transitions, static fallback).

## Decisions Log
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

## Blockers / Open Questions
*(none currently)*
