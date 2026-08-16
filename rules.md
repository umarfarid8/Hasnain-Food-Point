# Rules — Hasnain Food Point

These are standing instructions for whoever (or whatever agent) is building this project. Paste this file's path into Antigravity's custom instructions / rules, or `@`-mention it at the start of every session.

## Always Do
- Read `PRD.md`, `architecture.md`, and `design.md` before writing code for a new section.
- Build **mobile-first** — check every component at 360–400px width before anything wider.
- Keep the WhatsApp CTA visible/reachable within one tap from any scroll position.
- Use the design tokens from `design.md` (colors, fonts) — never hardcode a random hex color.
- Optimize every image (WebP, compressed) and lazy-load anything below the fold.
- Give the 3D hero a static-image fallback for slow connections/low-end devices.
- Keep text short and simple — assume the reader may skim, not read carefully.
- After finishing a task, update `memory.md` (what's done, what file you're on, what's next).
- Commit after each completed phase/task with a clear message.
- Pull the WhatsApp number and business info from `/api/settings`, never hardcode it in a component.
- Point the app at the **deployed** API URL (not `localhost`) before sharing any APK with anyone but yourself — a phone can't reach your dev machine.
- Keep the release keystore file and its password somewhere safe and backed up — losing it means the app can never be updated in place, only reinstalled fresh.

## Never Do
- Don't add authentication, user accounts, cart, or payment — explicitly out of scope (see PRD.md §6).
- Don't introduce a global state library (Redux, Zustand, etc.) — this app doesn't need one.
- Don't over-engineer the backend with Clean Architecture layers, CQRS, repositories-on-repositories — a Controller + EF Core is enough for 2 endpoints.
- Don't block the main thread with a heavy 3D scene on page load — always lazy-load and provide a fallback.
- Don't use English-only jargon in UI copy — keep language simple, and prefer icons over paragraphs.
- Don't invent menu items, prices, or owner details — use placeholders clearly marked `TODO` until the client provides real content, and never ship a placeholder as final content.
- Don't add new API endpoints or pages that aren't in `PRD.md` without flagging it first — resist scope creep.
- Don't skip testing the WhatsApp deep link on an actual Android device — WebView behavior can differ from desktop Chrome.
- Don't commit the release keystore or its passwords to git — keep them out of the repo entirely (`.gitignore` it), store them separately.

## Antigravity-Specific Workflow Rules
- Use **Planning mode** for anything that touches more than one file or introduces a new feature; use **Fast mode** only for small, well-defined fixes.
- Keep prompts short by referencing the docs instead of re-explaining: e.g. `Implement Phase 2 from @phases.md, following @architecture.md and @design.md.`
- Review the Plan Artifact before letting the agent execute — reject/adjust bad library choices there, not after 500 lines are written.
- One phase = one agent task where possible, so context stays focused and credit usage stays predictable.
