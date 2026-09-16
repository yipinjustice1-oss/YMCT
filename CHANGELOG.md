# Changelog

## v1.1.0 — Store + Blog + Cleanup (2026-09-16)

- **Store**: added `shop.html` (guzheng + accessory catalog with cart) and `checkout.html` (shipping form, payment method incl. PayNow QR placeholder, order review, confirmation via WhatsApp/copy).
- **Blog**: added `blog.html` index and three SEO articles under `blog/` (buying guide, care guide, guzheng history) with meta descriptions, canonical URLs, and JSON-LD schema.
- **Cleanup**: fixed the mobile nav (hamburger menu was missing, so nav links were unreachable on phones), added `rel="noopener noreferrer"` to external WhatsApp links, added Shop/Blog entries to nav and footer, and factored shared language/cart/nav logic into `assets/main.js`.

See `README.md` for how to add your real PayNow QR code and update the product catalog.
