# YMCT Website

Static, no-build website for 逸梅草堂 (YMCT) — plain HTML + Tailwind CSS (via CDN) + vanilla JS. No server, database, or build step required; open the HTML files directly or host them on any static file host.

## Site map

| Page | Purpose |
|---|---|
| `index.html` | Main marketing page: concept, membership tiers, contact, location, FAQ, T&Cs |
| `guzheng-trial.html` | Dedicated ad-landing page for a 1-on-1 trial class: price card, selling points, lead form, WhatsApp CTA |
| `kids-guzheng.html` / `adult-guzheng.html` | Audience-targeted variants of the trial page, for separate ad groups/keywords |
| `faq.html` | Standalone FAQ page (also used as a Google Ads sitelink target) |
| `shop.html` | Live guzheng catalog (grouped by series) with an add-to-cart panel |
| `checkout.html` | Cart review → shipping details → payment method → order confirmation |
| `blog.html` | Blog index (for SEO) |
| `blog/*.html` | Individual blog posts, each with its own meta description, canonical URL, and JSON-LD `BlogPosting` schema |
| `assets/main.js` | Shared JS: language toggle, mobile nav, product catalog, cart logic, and the trial-lead-form/conversion-tracking helpers used by every page |
| `assets/products/*.jpg` | Real product photos, one per guzheng |

## Checkout & payments

**There is no payment gateway or backend.** The checkout flow is entirely client-side (cart state lives in the browser's `localStorage`) and ends by handing the order details to the business over WhatsApp — the same channel already used for enquiries — plus a "Copy Order Summary" fallback button for accessibility. Specifically:

1. Customer adds items on `shop.html` (cart persists in `localStorage`).
2. On `checkout.html` they fill in contact/shipping details and pick a payment method (PayNow QR, bank transfer, or cash/cheque on collection).
3. Submitting generates an order number and a confirmation screen with the full order as text, which the customer sends via a pre-filled WhatsApp message to confirm payment and delivery, or copies to send another way.

If you later want automated online payments (e.g. actual PayNow API, Stripe, HitPay), that requires a real backend/payment processor and is a separate project from this static site.

### Adding your real PayNow QR code

The checkout page ships with a placeholder QR graphic (`assets/paynow-qr-placeholder.svg`) clearly marked "REPLACE WITH YOUR PAYNOW QR CODE". To use your real one:

1. Export your PayNow QR code from your bank app as an image.
2. Save it as `assets/paynow-qr.png` (exact filename).
3. That's it — `checkout.html` already points at `assets/paynow-qr.png` first and only falls back to the placeholder graphic if that file is missing, so no code changes are needed.

Also update the bank transfer placeholder text (bank name, account name, account number) in `checkout.html` — search for `[Your Bank Name]` and `[Your Account Number]`.

## Updating the product catalog

All products, including series, names, materials, photos, and prices, are defined in one place: the `YMCT_PRODUCTS` array (and the `YMCT_SERIES` list it groups by) near the top of `assets/main.js`. Prices are stored in cents (e.g. `136800` = S$1,368.00) to avoid floating-point rounding errors. Add, remove, or edit entries there and both `shop.html` and `checkout.html` pick up the change automatically. Product photos live in `assets/products/`; point a product's `image` field at the right file there.

**Current catalog source:** the 11 products live in the shop are pulled from the business's inventory spreadsheet (仲尼/艺林古筝价格表) — the final selling price used is the sheet's "manually edited auspicious numbers" column, and photos were extracted from the same workbook and matched to each row. When inventory changes, update `YMCT_PRODUCTS` (and add/replace the matching file in `assets/products/`) to keep the site in sync.

There is no shipping fee calculated at checkout — each guzheng is a handcrafted, fragile instrument, so delivery is arranged personally with the customer after the order is confirmed (see `ymctSubmitOrder()` in `checkout.html`).

## Google Ads landing pages

`guzheng-trial.html`, `kids-guzheng.html`, and `adult-guzheng.html` exist specifically so paid search traffic lands on a page that matches the ad's keyword (a general club-branding homepage converts worse and costs more per click). Each has a short lead form that, on submit, opens WhatsApp with the form's details pre-filled (same no-backend pattern as checkout) via `ymctSubmitTrialForm()` in `assets/main.js`. A standalone "WhatsApp Us" button on each page is wired separately via `ymctTrackWhatsAppClick()`.

**Two things on `guzheng-trial.html` are placeholders that must be filled in with real information before running any ads — do not launch with these as-is:**

1. **Trial class price and length** — shown in a dashed-border "S$XX for XX minutes" card. This is a factual, public-facing price, so it was deliberately left as an obvious placeholder rather than guessed at.
2. **Studio photos** — the "Inside Our Studio" section has placeholder tiles. Real photos of 3 Jalan Tupai should replace them (add files under `assets/studio/` and swap the placeholder `<div>` for an `<img>`, following the same pattern as the PayNow QR placeholder above).

**Conversion tracking:** there is no Google Ads/Analytics account connected to this site yet, so `ymctTrackConversion()` in `assets/main.js` is currently a no-op that just logs to the console. To wire up real tracking:
1. Add the Google tag (`gtag.js`) for your account in `<head>` on every page (or via Google Tag Manager).
2. Replace the body of `ymctTrackConversion()` with a `gtag('event', 'conversion', { send_to: '...' })` call — use your **primary** conversion action's ID for form submissions, and a separate **secondary** one (marked "Don't use in bidding" in Google Ads) for WhatsApp clicks, so Google doesn't optimise toward cheap clicks that never book.

## Blog / SEO

Each post under `blog/` is a standalone HTML page with:
- a unique `<title>` and `<meta name="description">`
- a `<link rel="canonical">` (update the domain in these once the site has a real URL)
- Open Graph tags for social sharing
- JSON-LD `BlogPosting` structured data
- internal links to the shop and to related posts

To add a new post: copy an existing file under `blog/`, update its content/meta/JSON-LD, and add a card linking to it in `blog.html`.

## Language toggle

The site is bilingual (Simplified Chinese / English) using a CSS-based toggle: every bilingual string is duplicated in a `<span class="lang-zh">` and a `<span class="lang-en">`, and `:lang()` CSS rules hide whichever one doesn't match `<html lang="...">`. The toggle button flips this attribute and remembers the choice in `localStorage` (shared across pages via `assets/main.js`).

## Known placeholders to replace before launch

- `assets/paynow-qr.png` — real PayNow QR (see above)
- Bank transfer details in `checkout.html`
- Trial class price/length and studio photos on `guzheng-trial.html` (see "Google Ads landing pages" above)
- Google Ads conversion tracking in `ymctTrackConversion()` (see above)
- `assets/paynow-qr-placeholder.svg`/logo file `WhatsApp Image 2026-08-09 at 18.57.27_2.jpeg` — swap for a proper logo asset
- Canonical URLs across all pages use `https://unihomesg.com/...` — update if the production domain differs
