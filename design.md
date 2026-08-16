# Design — Hasnain Food Point

Proposed starting point below — treat it as a first draft, swap it out once the client shares an existing logo/brand colors (see questions at the end).

## 1. Theme Direction: "Warm Ember"
A dark, premium backdrop that makes food photography and 3D visuals pop — the same trick used by modern food-brand sites — paired with warm, appetite-driving accent colors so it still feels like a food point, not a tech product.

## 2. Color Palette
| Token | Hex | Use |
|---|---|---|
| `--bg-primary` | `#141110` | Main background (near-black, warm undertone) |
| `--bg-surface` | `#1F1B19` | Cards, sections |
| `--accent-primary` | `#FF5A1F` | Primary CTA (WhatsApp/order buttons), highlights |
| `--accent-secondary` | `#F4B93E` | Secondary accents, prices, hover states |
| `--text-primary` | `#FAF6F2` | Headings, primary text on dark bg |
| `--text-secondary` | `#C9C0BA` | Body/secondary text on dark bg |
| `--success-whatsapp` | `#25D366` | Keep the actual WhatsApp brand green specifically for the WhatsApp icon/button, so it's instantly recognizable |
| `--border-subtle` | `#2E2925` | Card borders, dividers |

Note: keeping the real WhatsApp green for that one button is intentional — low-literacy users recognize the WhatsApp icon/color instantly; don't reskin it to match the brand palette.

## 3. Typography
| Role | Font | Notes |
|---|---|---|
| Headings (English) | **Poppins** (ExtraBold/Bold) | Rounded, friendly, very legible at large sizes |
| Body (English) | **Inter** or **Poppins Regular** | High legibility on small/cheap screens |
| Urdu/Roman-Urdu labels | **Noto Nastaliq Urdu** (for proper Urdu script) | Only if/when true Urdu script labels are added; Roman Urdu ("Order Karein") can just use the body font |
| Prices/numbers | Same as body, `font-variant-numeric: tabular-nums` | Keeps price columns aligned |

**Type scale (mobile-first):**
- H1 (hero title): 32–40px, bold
- H2 (section titles): 24–28px, bold
- H3 (item names): 18–20px, semibold
- Body: 15–16px — never smaller than 14px, given the target audience
- Price: 16–18px, semibold, `--accent-secondary`

## 4. UI Principles (tied back to PRD §3)
- **Icon + label, always together** — never an icon-only button for a primary action.
- **High contrast** — text-on-dark must pass at least WCAG AA; test the actual hex pairs.
- **Big tap targets** — buttons min 44×44px, generous spacing between tappable items so mis-taps are rare on small screens.
- **Photography-led menu cards** — the image is the hero of each card, price is the second-most prominent element, description text is minimal (5–8 words) or omitted in favor of the photo.
- **One accent color per action type** — orange/gold for "look/browse," WhatsApp green reserved only for "order/contact."

## 5. Motion Style
- Subtle scroll-triggered fade/slide-up for section entrances (Framer Motion), nothing longer than ~400ms — don't make users wait to see content.
- Hero 3D scene: gentle idle rotation/float, not aggressive spinning — should feel premium, not gimmicky.
- Respect `prefers-reduced-motion`.
