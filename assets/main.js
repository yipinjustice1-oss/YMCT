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
/* Prices are in SGD, stored as integers (cents) to avoid float rounding. */
const YMCT_PRODUCTS = [
    {
        id: 'gz-student',
        category: 'instrument',
        name_zh: '学生入门古筝（21弦）',
        name_en: 'Student Guzheng (21-String)',
        desc_zh: '适合初学者的稳定入门古筝，实木琴身，随附琴架与调音工具。',
        desc_en: 'A stable entry-level guzheng for beginners. Solid wood body, includes stand and tuning tool.',
        price: 68000
    },
    {
        id: 'gz-intermediate',
        category: 'instrument',
        name_zh: '进阶古筝（3-6级适用）',
        name_en: 'Intermediate Guzheng (Grade 3–6)',
        desc_zh: '升级音板与出音表现，适合已完成基础考级的学生。',
        desc_en: 'Upgraded soundboard and projection, ideal for students who have completed foundational grading.',
        price: 128000
    },
    {
        id: 'gz-professional',
        category: 'instrument',
        name_zh: '专业演奏古筝',
        name_en: 'Professional Performance Guzheng',
        desc_zh: '精选桐木手工制作，音色饱满，专为舞台演出与高阶演奏者打造。',
        desc_en: 'Hand-carved from select paulownia wood with a rich, full tone — built for the stage and advanced players.',
        price: 288000
    },
    {
        id: 'acc-strings',
        category: 'accessory',
        name_zh: '古筝专用琴弦（全套21根）',
        name_en: 'Guzheng String Set (Full Set of 21)',
        desc_zh: '标准21弦全套替换弦，音质稳定持久。',
        desc_en: 'A full 21-string replacement set with stable, long-lasting tone.',
        price: 4500
    },
    {
        id: 'acc-picks',
        category: 'accessory',
        name_zh: '义甲 / 指甲套装',
        name_en: 'Finger Picks Set',
        desc_zh: '舒适贴合手指，适合日常练习与登台演出。',
        desc_en: 'Comfortable, well-fitted picks suitable for daily practice and performances.',
        price: 3800
    },
    {
        id: 'acc-stand',
        category: 'accessory',
        name_zh: '古筝琴架',
        name_en: 'Guzheng Stand',
        desc_zh: '稳固耐用，可折叠收纳，方便搬运。',
        desc_en: 'Sturdy and durable, foldable for easy storage and transport.',
        price: 12000
    },
    {
        id: 'acc-bag',
        category: 'accessory',
        name_zh: '古筝防潮包',
        name_en: 'Guzheng Dust & Travel Bag',
        desc_zh: '防潮防尘，加厚保护，适合日常存放与外出携带。',
        desc_en: 'Moisture- and dust-resistant with thick padding — great for storage and travel.',
        price: 8500
    }
];

const YMCT_CART_KEY = 'ymct_cart';
const YMCT_SHIPPING_FLAT_CENTS = 1500;
const YMCT_FREE_SHIPPING_THRESHOLD_CENTS = 50000;

function ymctFindProduct(id) {
    return YMCT_PRODUCTS.find(p => p.id === id);
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

function ymctShippingCost(subtotal) {
    if (subtotal <= 0) return 0;
    return subtotal >= YMCT_FREE_SHIPPING_THRESHOLD_CENTS ? 0 : YMCT_SHIPPING_FLAT_CENTS;
}

function ymctUpdateCartBadge() {
    const count = ymctCartCount();
    document.querySelectorAll('.cart-badge-count').forEach(el => {
        el.textContent = String(count);
        el.classList.toggle('hidden', count === 0);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    applySavedLanguage();
    ymctUpdateCartBadge();
});
