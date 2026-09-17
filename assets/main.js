/*
 * YMCT shared site script.
 * Loaded on every page: handles language toggle, mobile nav, and the
 * client-side shop cart (no backend — see README.md "Checkout & Payments").
 */

/* ---------- Language toggle (shared across all pages) ---------- */
function toggleLanguage() {
    const html = document.documentElement;
    const currentLang = html.getAttribute('lang');
    const newLang = currentLang === 'zh-SG' ? 'en' : 'zh-SG';
    html.setAttribute('lang', newLang);
    localStorage.setItem('preferredLanguage', newLang);
}

function applySavedLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        document.documentElement.setAttribute('lang', savedLang);
    }
}

/* ---------- Mobile nav menu ---------- */
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-btn');
    if (!menu || !btn) return;
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!isOpen));
}

/* ---------- Product catalog ---------- */
/* Prices are in SGD, stored as integers (cents) to avoid float rounding.
 * Sourced from the current inventory sheet (仲尼/艺林古筝价格表) — series,
 * model name, material, and product photo per row; price is the
 * "manually edited auspicious numbers" column, which is the final
 * selling price. Series order matches the sheet: 仲尼·志士 → 仲尼·君子 →
 * 仲尼·大贤 → 仲尼·至圣 → 艺林. */
const YMCT_SERIES = [
    { id: 'zhongni-zhishi', name_zh: '仲尼·志士', name_en: 'Zhongni · Aspirant Series' },
    { id: 'zhongni-junzi', name_zh: '仲尼·君子', name_en: 'Zhongni · Gentleman Series' },
    { id: 'zhongni-daxian', name_zh: '仲尼·大贤', name_en: 'Zhongni · Great Sage Series' },
    { id: 'zhongni-zhisheng', name_zh: '仲尼·至圣', name_en: 'Zhongni · Supreme Sage Series' },
    { id: 'yilin', name_zh: '艺林', name_en: 'Yilin Series' }
];

const YMCT_PRODUCTS = [
    {
        id: 'mingde',
        series: 'zhongni-zhishi',
        name_zh: '明德',
        name_en: 'Míngdé — Bright Virtue',
        material_zh: '花梨木',
        material_en: 'Rosewood (Huali)',
        image: 'assets/products/mingde.jpg',
        price: 136800
    },
    {
        id: 'taoyao',
        series: 'zhongni-zhishi',
        name_zh: '桃夭',
        name_en: 'Táoyāo — Peach Blossom',
        material_zh: '花梨木',
        material_en: 'Rosewood (Huali)',
        image: 'assets/products/taoyao.jpg',
        price: 136800
    },
    {
        id: 'zhishan',
        series: 'zhongni-junzi',
        name_zh: '至善（137）',
        name_en: 'Zhìshàn — Utmost Goodness (137cm)',
        material_zh: '非檀木',
        material_en: 'Non-sandalwood hardwood',
        image: 'assets/products/zhishan.jpg',
        price: 90000
    },
    {
        id: 'zhichu',
        series: 'zhongni-junzi',
        name_zh: '之初（137）',
        name_en: 'Zhīchū — The Beginning (137cm)',
        material_zh: '黑胡桃木',
        material_en: 'Black Walnut',
        image: 'assets/products/zhichu.jpg',
        price: 108000
    },
    {
        id: 'zijin',
        series: 'zhongni-junzi',
        name_zh: '子衿',
        name_en: 'Zǐjīn — Blue Collar',
        material_zh: '进口非洲巴花木',
        material_en: 'Imported African Bubinga',
        image: 'assets/products/zijin.jpg',
        price: 160000
    },
    {
        id: 'zhuoyu',
        series: 'zhongni-junzi',
        name_zh: '琢玉',
        name_en: 'Zhuóyù — Carved Jade',
        material_zh: '桐木',
        material_en: 'Paulownia',
        image: 'assets/products/zhuoyu.jpg',
        price: 168000
    },
    {
        id: 'jinyu',
        series: 'zhongni-junzi',
        name_zh: '瑾瑜',
        name_en: 'Jǐnyú — Fine Jade',
        material_zh: '黄檀木',
        material_en: 'Yellow Sandalwood',
        image: 'assets/products/jinyu.jpg',
        price: 228000
    },
    {
        id: 'suifeng',
        series: 'zhongni-daxian',
        name_zh: '岁丰',
        name_en: 'Suìfēng — Abundant Harvest',
        material_zh: '黑金柚木',
        material_en: 'Black Gold Teak',
        image: 'assets/products/suifeng.jpg',
        price: 249900
    },
    {
        id: 'xiujixinkuan',
        series: 'zhongni-daxian',
        name_zh: '修己新款',
        name_en: 'Xiūjǐ — Self-Cultivation (New Edition)',
        material_zh: '黑金柚木',
        material_en: 'Black Gold Teak',
        image: 'assets/products/xiujixinkuan.jpg',
        price: 298800
    },
    {
        id: 'guichaohuan',
        series: 'zhongni-zhisheng',
        name_zh: '归朝欢',
        name_en: 'Guī Cháo Huān — Return to Court in Joy',
        material_zh: '紫檀',
        material_en: 'Zitan Rosewood',
        image: 'assets/products/guichaohuan.jpg',
        price: 1080000
    },
    {
        id: 'yueshan',
        series: 'yilin',
        name_zh: '乐（yào）山',
        name_en: 'Yào Shān — Joy in Mountains',
        material_zh: '黑柿木',
        material_en: 'Black Persimmon Wood',
        image: 'assets/products/yueshan.jpg',
        price: 488800
    }
];

const YMCT_CART_KEY = 'ymct_cart';
/* Each guzheng is a handcrafted, fragile instrument, so delivery is arranged
 * personally with the customer (white-glove/in-person handover) rather than
 * a flat courier fee — no shipping charge is added at checkout. */

function ymctFindProduct(id) {
    return YMCT_PRODUCTS.find(p => p.id === id);
}

function ymctFindSeries(id) {
    return YMCT_SERIES.find(s => s.id === id);
}

function ymctFormatPrice(cents) {
    return 'S$' + (cents / 100).toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ymctGetCart() {
    try {
        const raw = localStorage.getItem(YMCT_CART_KEY);
        const cart = raw ? JSON.parse(raw) : [];
        return Array.isArray(cart) ? cart : [];
    } catch (e) {
        return [];
    }
}

function ymctSaveCart(cart) {
    try {
        localStorage.setItem(YMCT_CART_KEY, JSON.stringify(cart));
    } catch (e) {
        /* localStorage unavailable (private mode, quota) — cart just won't persist */
    }
    ymctUpdateCartBadge();
}

function ymctAddToCart(id, qty) {
    qty = qty || 1;
    const cart = ymctGetCart();
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id: id, qty: qty });
    }
    ymctSaveCart(cart);
}

function ymctSetQty(id, qty) {
    let cart = ymctGetCart();
    qty = Math.max(0, Math.floor(qty) || 0);
    if (qty === 0) {
        cart = cart.filter(item => item.id !== id);
    } else {
        const existing = cart.find(item => item.id === id);
        if (existing) existing.qty = qty;
    }
    ymctSaveCart(cart);
}

function ymctRemoveFromCart(id) {
    const cart = ymctGetCart().filter(item => item.id !== id);
    ymctSaveCart(cart);
}

function ymctClearCart() {
    ymctSaveCart([]);
}

function ymctCartLines() {
    return ymctGetCart()
        .map(item => {
            const product = ymctFindProduct(item.id);
            if (!product) return null;
            return { product: product, qty: item.qty, lineTotal: product.price * item.qty };
        })
        .filter(Boolean);
}

function ymctCartCount() {
    return ymctGetCart().reduce((sum, item) => sum + item.qty, 0);
}

function ymctCartSubtotal() {
    return ymctCartLines().reduce((sum, line) => sum + line.lineTotal, 0);
}

function ymctUpdateCartBadge() {
    const count = ymctCartCount();
    document.querySelectorAll('.cart-badge-count').forEach(el => {
        el.textContent = String(count);
        el.classList.toggle('hidden', count === 0);
    });
}

/* ---------- Trial lead form + WhatsApp handoff ---------- */
const YMCT_WHATSAPP_NUMBER = '6591520999';

/*
 * Conversion tracking stub. This site has no Google Ads/Analytics tag wired
 * up yet (no account ID was provided), so this is a safe no-op until one is
 * added. To wire up real Google Ads conversion tracking:
 *   1. Add the Google tag (gtag.js) snippet for your account in <head> on
 *      every page (or via Google Tag Manager).
 *   2. Replace the body of this function with:
 *        gtag('event', 'conversion', { send_to: 'AW-XXXXXXX/YYYYYYYY' });
 *      using the primary ("Trial form submit") conversion action's ID for
 *      formSubmit calls, and a separate secondary conversion ID (marked
 *      "Don't use in bidding" in Google Ads, per the ads feedback) for
 *      whatsappClick calls.
 * Until then this only logs to the console so you can verify the trigger
 * points are firing correctly during testing.
 */
function ymctTrackConversion(eventName) {
    if (window.gtag) {
        window.gtag('event', eventName);
    } else {
        console.info('[YMCT conversion stub]', eventName, '— wire up gtag() in assets/main.js to send this to Google Ads');
    }
}

function ymctTrackWhatsAppClick() {
    ymctTrackConversion('whatsapp_click');
}

/*
 * Generic trial/lead form handler shared by guzheng-trial.html,
 * kids-guzheng.html, and adult-guzheng.html. Same no-backend pattern as the
 * shop checkout: builds a WhatsApp message from the form fields and opens
 * it, since there's no server to receive submissions. `sourceLabel` is
 * prepended to the message so replies coming from different pages can be
 * told apart (e.g. "Kids Guzheng page").
 */
function ymctSubmitTrialForm(form, sourceLabel) {
    const errorEl = form.querySelector('.trial-form-error');
    if (!form.reportValidity()) {
        if (errorEl) {
            errorEl.textContent = document.documentElement.lang === 'zh-SG' ? '请填写所有必填字段。' : 'Please fill in all required fields.';
            errorEl.classList.remove('hidden');
        }
        return false;
    }
    if (errorEl) errorEl.classList.add('hidden');

    const data = new FormData(form);
    const lines = [`New trial enquiry — ${sourceLabel}`, ''];
    for (const [key, value] of data.entries()) {
        if (String(value).trim() === '') continue;
        lines.push(`${key}: ${value}`);
    }
    const message = lines.join('\n');

    ymctTrackConversion('trial_form_submit');

    const successEl = form.querySelector('.trial-form-success');
    form.classList.add('hidden');
    if (successEl) successEl.classList.remove('hidden');

    window.open('https://wa.me/' + YMCT_WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    applySavedLanguage();
    ymctUpdateCartBadge();
});
