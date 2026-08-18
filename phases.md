# Phases — Hasnain Food Point

Work through these in order. Each phase = one focused Antigravity task (Planning mode), so the agent's context stays small and credits aren't wasted re-exploring the whole project each time.

**Credit-saving habit:** never re-paste the spec into the prompt — the docs already contain it. Just point the agent at the files with `@`. Keep prompts to 1–3 sentences.

---

### Phase 0 — Project Setup
**Goal:** Empty but correctly-scaffolded backend + frontend + Capacitor Android shell, docs in place, repo initialized.
```
Read @PRD.md @architecture.md @rules.md. Scaffold the two projects exactly as described
in architecture.md's folder structures: HasnainFoodPoint.Api (.NET 8 Web API + EF Core,
SQL Server) and hasnain-food-point-web (React + Vite + Tailwind). Add Capacitor to
hasnain-food-point-web per architecture.md §8 and run `npx cap add android` so an empty
Android shell exists. No feature code yet. Update memory.md when done.
```

### Phase 1 — Backend: Menu & Settings API
**Goal:** `/api/menu` and `/api/settings` working with seeded placeholder data.
```
Following @architecture.md, implement Category, MenuItem, BusinessInfo models, EF Core
DbContext + migration, MenuController and SettingsController. Seed with placeholder data
from @PRD.md. Follow @rules.md. Update memory.md.
```

### Phase 2 — Frontend Skeleton & Layout
**Goal:** App shell, routing (single page), Navbar, Footer, WhatsAppFloatButton, API hooks — no styling polish yet.
```
Implement Phase 2 from @phases.md: app shell, layout components, useMenu and
useWhatsAppLink hooks calling the API from @architecture.md. Follow @rules.md.
Update memory.md.
```

### Phase 3 — Static Content Sections
**Goal:** Hero (static, no 3D yet), Menu grid (plain cards), About Owner, Location — all functional and responsive, using design.md tokens.
```
Build Hero (static version), MenuGrid, MenuItemCard, OwnerStory, and LocationCard per
@design.md and @PRD.md §4. Mobile-first, use placeholder content marked TODO where real
content isn't provided yet. Update memory.md.
```

### Phase 4 — 3D & Animation Layer
**Goal:** Replace the static hero with the Spline/3D scene, add Framer Motion entrance/scroll animations, add fallback for slow connections.
```
Implement Phase 4 from @phases.md: integrate the Spline hero scene and Framer Motion
animations per @architecture.md §7 and @rules.md's performance rules (lazy load + static
fallback). Update memory.md.
```

### Phase 5 — Low-Literacy & Performance Pass
**Goal:** Icon/label audit, font/contrast check, test on throttled 3G, test on a low-end-device emulation, trim copy.
```
Do a pass over the whole app against @PRD.md §3 (target-user design implications) and
@rules.md performance rules. Flag anything that relies on reading dense text or fails on
a throttled connection. Fix what you can; list what needs my input. Update memory.md.
```

### Phase 6 — Deploy Backend & Build the APK
**Goal:** Backend live on a real HTTPS URL, app icon/splash added, signed release APK produced and tested on a real phone.
```
Prepare deployment config for the backend (Azure/Render) per @architecture.md §2 and wire
the frontend's API base URL to the deployed URL via environment config. Add app icon and
splash screen assets to the Capacitor Android project. Walk me through generating a
release keystore and building a signed APK per @architecture.md §8. Update memory.md with
the final status and where the keystore is stored.
```
This is a good phase to do semi-manually rather than fully agent-driven — signing/keystore steps are one-time, sensitive (losing the keystore means you can't update the app later), and worth doing carefully yourself with the agent's guidance rather than letting it run unattended.

---

### Phase 6.5 → now Phase 7 — Web Deploy + Admin Panel
**Goal:** Web version live at a real URL (needed so the owner can reach `/admin` — the APK has no address bar), plus a password-protected admin page to edit prices and toggle item availability.

**Scope (confirmed):** owner can edit price and toggle available/sold-out per item only. No add/delete items, no category editing, no photo upload, no business-info editing — keep it to exactly this.

```
Implement Phase 7 from @phases.md:
1. Deploy hasnain-food-point-web's existing dist/ build to Vercel or Netlify, unchanged,
   at a real public URL.
2. Backend: add a single-password admin auth — POST /api/admin/login checks a password
   stored in appsettings (hashed, not plaintext) against AdminSettings:Password, returns a
   short-lived JWT on success. No user table, no registration flow — this is a deliberate
   single-owner exception to the "no auth" rule in rules.md, scoped to just this endpoint
   and the two below.
3. Backend: add PUT /api/admin/menu-items/{id} (body: price, isAvailable), protected by
   the JWT from step 2.
4. Frontend: add an /admin route (not linked from anywhere in the customer-facing UI) with
   a simple password login form, then a list of menu items with an editable price field
   and an available/sold-out toggle per item, and a Save button per row.
5. This must NOT touch the Android/Capacitor project at all — no APK rebuild needed for
   this feature.
Update memory.md with the deployed web URL and confirmation the APK was untouched.
```

---

### Phase 2.x — superseded by Phase 7 above (kept here for history only)

