# YMCT Website

Static, no-build website for 逸梅草堂 (YMCT) — plain HTML + Tailwind CSS (via CDN) + vanilla JS. No server, database, or build step required; open the HTML files directly or host them on any static file host.

## Site map

| Page | Purpose |
|---|---|
| `index.html` | Main marketing page: concept, membership tiers, contact, location, FAQ, T&Cs |
| `shop.html` | Live guzheng catalog (grouped by series) with an add-to-cart panel |
| `checkout.html` | Cart review → shipping details → payment method → order confirmation |
| `blog.html` | Blog index (for SEO) |
| `blog/*.html` | Individual blog posts, each with its own meta description, canonical URL, and JSON-LD `BlogPosting` schema |
| `assets/main.js` | Shared JS: language toggle, mobile nav, product catalog, and cart logic used by every page |
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
- `assets/paynow-qr-placeholder.svg`/logo file `WhatsApp Image 2026-08-09 at 18.57.27_2.jpeg` — swap for a proper logo asset
- Canonical URLs in `blog/*.html` and `blog.html` (currently `https://ymct.example.com/...`) — update once the real domain is live
