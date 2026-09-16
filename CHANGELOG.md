# Changelog

## v1.2.0 — Real Catalog Sync (2026-09-16)

- Replaced the placeholder product catalog with the actual current inventory: 11 guzhengs across the 仲尼·志士/君子/大贤/至圣 and 艺林 series, sourced from the business's inventory spreadsheet.
- Final selling prices match the spreadsheet's "manually edited auspicious numbers" column exactly.
- Added real product photos (extracted from the same workbook and matched to each model) to `assets/products/`, shown on `shop.html` and in the `checkout.html` order summary.
- Removed the fictional accessories catalog (strings/picks/stand/bag) — the current inventory is guzhengs only.
- Delivery is no longer a flat courier fee; each guzheng is arranged for personal/white-glove delivery after order confirmation.
- Adjusted blog copy that referenced now-removed placeholder products to reference the real series tiers instead.

## v1.1.0 — Store + Blog + Cleanup (2026-09-16)

- **Store**: added `shop.html` (guzheng + accessory catalog with cart) and `checkout.html` (shipping form, payment method incl. PayNow QR placeholder, order review, confirmation via WhatsApp/copy).
- **Blog**: added `blog.html` index and three SEO articles under `blog/` (buying guide, care guide, guzheng history) with meta descriptions, canonical URLs, and JSON-LD schema.
- **Cleanup**: fixed the mobile nav (hamburger menu was missing, so nav links were unreachable on phones), added `rel="noopener noreferrer"` to external WhatsApp links, added Shop/Blog entries to nav and footer, and factored shared language/cart/nav logic into `assets/main.js`.

See `README.md` for how to add your real PayNow QR code and update the product catalog.
