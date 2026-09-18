# Changelog

## Unreleased

- Filled in the trial class price/length placeholder on `guzheng-trial.html` with
  the business's real numbers: S$68 per trial session, approx. 45 minutes.

## v1.3.0 — Google Ads Landing Pages (2026-09-17)

Implements the actionable, website-side parts of a Google Ads review: a dedicated,
keyword-matched landing page for paid guzheng-lesson traffic instead of sending
clicks to the general club-branding homepage, plus real pages to support sitelinks.

- Added `guzheng-trial.html`: headline, trial price/length card, 3 selling points
  (private lessons, unlimited supervised practice room, real stage performances),
  a short lead form, a separate WhatsApp CTA, and a studio-photos section.
- Added `kids-guzheng.html` and `adult-guzheng.html` as audience-targeted variants
  for separate ad groups, and `faq.html` as a real standalone FAQ page — Google
  Ads sitelinks need distinct pages, not anchors on one page.
- Added a trial-lead-form handler (`ymctSubmitTrialForm`) and a conversion-tracking
  stub (`ymctTrackConversion` / `ymctTrackWhatsAppClick`) to `assets/main.js`, so
  form submissions are the primary conversion and WhatsApp clicks a secondary one
  once a real Google Ads tag is wired in (see README).
- Homepage title, meta description, and hero copy now explicitly mention "guzheng"
  (previously the page never used the word, which hurts ad-to-landing-page match).
- Added a "Trial Class" and "FAQ" nav entry across every page, and routed existing
  in-text "book a trial" links at blog posts to the new dedicated page.
- **Left as clearly-marked placeholders, not guessed at:** the trial class price/
  length and the studio photos on `guzheng-trial.html` — both are real, public-
  facing claims that need the business's actual numbers/photos before launch.

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
