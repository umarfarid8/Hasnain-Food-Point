# Architecture — Hasnain Food Point

## 1. High-Level Approach
This is a **content-driven showcase app**, not a complex system — the architecture should stay intentionally light. Three moving pieces:

1. **ASP.NET Core Web API** — serves menu categories/items and business settings (WhatsApp number, hours, address) from SQL Server. This exists mainly so the **client can change prices/menu later without a rebuild** (via Phase-2 admin), and because it's the requested stack — not because the app needs "backend logic."
2. **React (Vite) frontend** — the actual app: owns all presentation, animation, and 3D.
3. **Capacitor** — wraps the built React app into a native Android shell to produce an installable `.apk`. The React app doesn't know or care it's running inside Capacitor vs. a browser — this is what makes "web later" nearly free (see §8).

No auth, no cart, no payment provider, no microservices. Resist the urge to add layers this project doesn't need (see rules.md).

**Primary deliverable now:** a signed `.apk` the client can share directly (WhatsApp/Drive link) for customers to sideload. **Not** going through the Play Store yet — that's a separate, later decision (needs a $25 one-time Google Play developer account + review process) and isn't in scope until you decide to do it.

## 2. Tech Stack
| Layer | Choice | Why |
|---|---|---|
| Backend | ASP.NET Core Web API (.NET 8) | Requested stack; simple Controller + EF Core, not full Clean Architecture — this app doesn't need it |
| Database | SQL Server (LocalDB in dev) | Matches stack; small schema (Category, MenuItem, BusinessInfo) |
| ORM | EF Core | Standard with ASP.NET |
| Frontend | React + Vite | Fast dev loop, good for animation-heavy SPA |
| Styling | Tailwind CSS | Fast, consistent with design tokens |
| Motion | Framer Motion | Scroll/entry animations, page transitions |
| "3D" product visuals | **Spline** (embedded scenes) as primary, **React Three Fiber** only if a specific custom interaction is needed | Modeling realistic food in raw Three.js is expensive; Spline lets us get an impressive rotating/interactive product scene without hand-authoring 3D assets. Use R3F only where Spline can't do what's needed. |
| Icons | lucide-react | Matches "icon-first" UX for low-literacy users |
| Mobile packaging | **Capacitor** | Wraps the same React build into a native Android shell → produces the `.apk` you can share directly |
| Hosting (backend + DB) | Azure App Service (Free/Basic) or Render | **Must be a real public HTTPS URL, deployed early** — the APK on a customer's phone can't reach `localhost`, so the API needs to be live before you share the APK with anyone but yourself |
| Hosting (frontend, later/optional) | Vercel or Netlify | Only needed when/if you deploy the *web* version — same `dist/` build the APK uses, so this is a same-day task whenever you decide to do it |

## 3. App Flow (customer journey)
```
Landing (Hero, 3D visual, WhatsApp CTA)
   │
   ▼
Scroll → Menu (by category)
   │            │
   │            ▼
   │      Tap item → WhatsApp opens, pre-filled: "Hi, I'd like to order: Aloo Roll"
   ▼
Scroll → About Owner (photo + story)
   │
   ▼
Scroll → Location & Hours → "Get Directions" (opens Maps)
   │
   ▼
Floating WhatsApp button available at every scroll position
```
Everything happens on **one page** (single-page scroll site). No routing complexity needed for MVP — if an admin panel is added later, that's a second, separate route (`/admin`), not part of the customer experience.

## 4. Backend Folder Structure
```
HasnainFoodPoint.Api/
├── Controllers/
│   ├── MenuController.cs        # GET /api/menu (categories + items)
│   └── SettingsController.cs    # GET /api/settings (whatsapp number, hours, address)
├── Models/
│   ├── Category.cs
│   ├── MenuItem.cs
│   └── BusinessInfo.cs
├── Data/
│   ├── AppDbContext.cs
│   ├── SeedData.cs              # seeds initial menu from PRD
│   └── Migrations/
├── DTOs/
│   ├── MenuItemDto.cs
│   └── CategoryDto.cs
├── Program.cs
└── appsettings.json
```

## 5. Frontend Folder Structure
```
hasnain-food-point-web/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── WhatsAppFloatButton.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       └── SectionHeading.jsx
│   ├── features/
│   │   ├── hero/HeroScene.jsx        # Spline/3D hero
│   │   ├── menu/MenuGrid.jsx
│   │   ├── menu/MenuItemCard.jsx
│   │   ├── about/OwnerStory.jsx
│   │   └── location/LocationCard.jsx
│   ├── hooks/
│   │   ├── useMenu.js                 # fetches /api/menu
│   │   └── useWhatsAppLink.js         # builds wa.me links
│   ├── lib/
│   │   ├── api.js
│   │   └── constants.js               # WhatsApp number, brand text
│   ├── assets/
│   │   ├── images/
│   │   └── fonts/
│   ├── styles/
│   │   └── tokens.css                 # color/font variables from design.md
│   ├── App.jsx
│   └── main.jsx
└── public/
```

## 6. API Endpoints (MVP)
| Method | Endpoint | Returns |
|---|---|---|
| GET | `/api/menu` | Categories with nested items (name, price, image URL, description) |
| GET | `/api/settings` | WhatsApp number, address, map link, opening hours |

That's it for MVP. Don't add more endpoints until a real feature needs them.

## 7. Key Technical Decisions
- **WhatsApp deep link:** `https://wa.me/<number>?text=<url-encoded message>` — built client-side in `useWhatsAppLink.js`, number comes from `/api/settings` (not hardcoded) so the client can change their number without a redeploy.
- **Performance budget for 3D:** Spline scene(s) must lazy-load below the fold where possible, and the hero scene must have a static image fallback for slow connections / low-end devices (see rules.md).
- **No global state library needed** — Context or plain hooks are enough for this app's size. Don't add Redux.

## 8. Mobile Packaging (Capacitor → APK)
- The build pipeline is: `react build` → `npx cap sync android` → open in Android Studio → build a **signed release APK**.
- `hasnain-food-point-web` gets a `capacitor.config.ts` and an `android/` folder added to it (not a separate project) — one codebase, one repo.
- **Signing:** a release APK needs a keystore (`.jks` file) to be signed with. Generate it once, keep it safe — the same keystore is needed for every future update, or the app can't be upgraded in place on a customer's phone.
- **"Web later" path:** the same `dist/` output Capacitor wraps can be deployed to Vercel/Netlify as a normal website, unchanged. No rewrite needed — this was the main reason Capacitor was chosen over a separate native codebase.
- **Testing on-device:** install the debug APK on your own phone via USB/`adb install` during development; only produce the signed release APK when ready to share with the client/customers.
- **Known risk to watch in Phase 4:** Android's WebView renders Spline/WebGL slightly differently than desktop Chrome — budget time in Phase 4 to test the 3D hero specifically on a real low/mid-range Android device, not just an emulator.
