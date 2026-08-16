# PRD — Hasnain Food Point (Digital Showcase)

## 1. Project Summary
A single-page, mobile-first app that showcases the menu of "Hasnain Food Point" (a small local food point: fries, amelet burger, aloo samosas, aloo rolls, aloo naan, cold drinks & juices) with an impressive, animated, near-3D presentation. The app does **not** take orders or payments online — every "Order" action opens WhatsApp with a pre-filled message so the customer talks directly to the shop.

**Distribution:** the primary deliverable is an installable **Android APK** the client shares directly with customers (WhatsApp/Drive link, sideloaded — not the Play Store, at least initially). A website version is a planned follow-up, built from the same codebase (see architecture.md §8), not a separate project.

This is a **showcase/marketing app**, not a transactional e-commerce app. Keep that in mind whenever a feature request threatens to grow scope (login, cart, payment, delivery tracking = out of scope).

## 2. Target Users
Two distinct groups — design for both, but the **customer** is priority #1:

**A. End customers (primary)**
- Local residents of a small town/village in Punjab, Pakistan — mixed literacy, many with **low English literacy** or low reading confidence generally.
- Mostly on **budget Android phones**, often with slow/unstable mobile data.
- Discover the site via a WhatsApp/Facebook link shared by the shop, not by searching.
- Decide what to eat by **looking at pictures**, not reading descriptions. Text should support the image, never replace it.
- Comfortable with WhatsApp (near-universal in this demographic) — this is why "Order on WhatsApp" is the single call-to-action, not a form.

**B. The shop owner / client (secondary)**
- Wants the app to look modern and impressive to build trust and status ("even our small food point has an app").
- Needs to be able to point to it proudly on social media.
- Not a technical user — won't be editing code, so menu changes should ideally not require a redeploy (see Architecture.md).

## 3. Design Implications of the Target User
- **Icon- and image-first UI.** Every action (call, order, directions) has a big, obvious icon + short label, never text-only.
- **Minimal reading required.** Short labels in simple words; Urdu/Roman Urdu alongside English where it helps (see Design.md).
- **Large tap targets** (44px+), no hover-dependent interactions, no tiny text.
- **Works on slow connections.** Heavy 3D/animation must be optional or gracefully degrade — a customer on 3G should still see the menu and be able to order within seconds.
- **One primary action repeated everywhere:** the WhatsApp button. Never bury it in a menu or footer only.

## 4. Core Features (MVP)
1. **Hero section** — shop name, tagline, an eye-catching animated/3D visual (e.g., a rotating burger or fries), and an immediate WhatsApp CTA.
2. **Menu showcase**, grouped by category (Burgers, Rolls, Naan, Samosas, Fries, Cold Drinks & Juices):
   - Each item: photo/3D view, name, price, and a WhatsApp order button ("Order on WhatsApp") that opens a chat pre-filled with the item name.
3. **Global floating WhatsApp button** — always visible, one tap to reach the shop for a general order/question.
4. **About the Owner** — photo + short story (2–4 sentences, simple language), building trust and a human connection.
5. **Location & timings** — address, opening hours, a "Get Directions" button (opens Google/Apple Maps).
6. **Responsive, mobile-first layout** — this is a phone-first product; desktop is secondary.

## 5. Nice-to-Have (Phase 2+, only after MVP is solid)
- Simple lightweight admin page for the owner to edit prices/availability (no-code-ish).
- Testimonials/reviews section.
- Urdu language toggle for full UI.
- Basic analytics (how many WhatsApp clicks) to show the client value.

## 6. Explicitly Out of Scope
- Online payments, cart, checkout.
- User accounts / login.
- Delivery tracking.
- Multi-branch support (single food point only, for now).

## 7. Success Criteria
- Client feels the app looks "impressive" and modern compared to competitors.
- A first-time visitor on a mid-range phone can go from landing on the page to sending a WhatsApp order in under 3 taps.
- Page is usable and still looks good on a slow 3G connection (3D degrades, doesn't break the page).

## 8. Open Questions (see end of chat for the full list)
- Final menu items, prices, and photos.
- WhatsApp business number.
- Owner's name, photo, and story text.
- Shop address/hours and map link.
- Any existing logo/brand colors from the client.
