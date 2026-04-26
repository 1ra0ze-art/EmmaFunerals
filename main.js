/* ═══════════════════════════════════════════════════════
   Emma Funeral Services — main.js
   All front-end logic: gallery, navigation, contact form,
   product modal, filtering, featured section, messages.
═══════════════════════════════════════════════════════ */

/* ── Default seed products (shown if admin hasn't added any) ── */
const SEED_PRODUCTS = [
  {
    id: 'seed-1',
    name: 'Royal Oak Classic',
    category: 'premium',
    price: '450,000 RWF',
    desc: 'Hand-finished solid oak with brass handles and ivory interior lining. A timeless choice for a dignified farewell.',
    img: null,
    wa: '+250788000000',
    tel: '+250788000000'
  },
  {
    id: 'seed-2',
    name: 'Mahogany Prestige',
    category: 'premium',
    price: '620,000 RWF',
    desc: 'Rich mahogany wood with velvet interior and polished silver hardware. Crafted to reflect the highest honour.',
    img: null,
    wa: '+250788000000',
    tel: '+250788000000'
  },
  {
    id: 'seed-3',
    name: 'Pine Serenity',
    category: 'standard',
    price: '180,000 RWF',
    desc: 'Clean, simple pine construction with a natural finish. Dignified simplicity at an honest price.',
    img: null,
    wa: '+250788000000',
    tel: '+250788000000'
  },
  {
    id: 'seed-4',
    name: 'Cedar Comfort',
    category: 'standard',
    price: '240,000 RWF',
    desc: 'Aromatic cedar with a smooth satin finish and soft white interior. A gentle, peaceful resting place.',
    img: null,
    wa: '+250788000000',
    tel: '+250788000000'
  },
  {
    id: 'seed-5',
    name: 'Ebony Heritage',
    category: 'luxury',
    price: '950,000 RWF',
    desc: 'Our finest offering — African ebony with hand-carved details, gold-plated handles, and silk interior. Reserved for extraordinary tributes.',
    img: null,
    wa: '+250788000000',
    tel: '+250788000000'
  },
  {
    id: 'seed-6',
    name: 'Wenge Grace',
    category: 'luxury',
    price: '780,000 RWF',
    desc: 'Deep-grained wenge with matte lacquer finish and premium cream satin lining. Refined elegance in every detail.',
    img: null,
    wa: '+250788000000',
    tel: '+250788000000'
  }
];

/* ─── Coffin icon SVGs for seed products (no image) ─── */
const COFFIN_COLORS = {
  premium: '#8B6914',
  standard: '#5a4a3a',
  luxury: '#2c1f0e'
};

/* ── Storage Helpers ── */
function getProducts() {
  const stored = JSON.parse(localStorage.getItem('emma_products') || '[]');
  // Merge seed products with admin-added products (seed shown if list is empty)
  return stored.length ? stored : SEED_PRODUCTS;
}

function getMessages() {
  return JSON.parse(localStorage.getItem('emma_messages') || '[]');
}

/* ── Active filter state ── */
let activeFilter = 'all';

/* ── Navigation ── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  const navLink = document.getElementById('nav-' + id);
  if (page) page.classList.add('active');
  if (navLink) navLink.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'gallery') renderGallery();
  if (id === 'home') renderFeatured();
}

/* ── Gallery Rendering ── */
function renderGallery() {
  const products = getProducts();
  const grid = document.getElementById('product-grid');
  const empty = document.getElementById('gallery-empty');

  // Filter products
  const filtered = activeFilter === 'all'
    ? products
    : products.filter(p => p.category === activeFilter);

  grid.innerHTML = '';

  if (!filtered.length) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img-wrap">
        ${productImageHtml(p)}
        <div class="product-category-badge">${categoryLabel(p.category)}</div>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-btns">
          <button class="btn-details" onclick="openModal('${p.id}')">View Details</button>
          <a class="btn-chat" href="https://wa.me/${cleanPhone(p.wa)}?text=${waText(p)}" target="_blank">💬 WhatsApp</a>
        </div>
      </div>`;
    grid.appendChild(card);
    // Animate in
    requestAnimationFrame(() => card.classList.add('visible'));
  });
}

function productImageHtml(p) {
  if (p.img) {
    return `<img src="${p.img}" alt="${p.name}" onerror="this.parentElement.querySelector('img').style.display='none'">`;
  }
  const col = COFFIN_COLORS[p.category] || '#5a4a3a';
  return `<div class="product-no-img">
    <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" style="width:80px;opacity:.35">
      <path d="M35 10 L65 10 L80 30 L80 130 L20 130 L20 30 Z" fill="none" stroke="${col}" stroke-width="2.5"/>
      <line x1="50" y1="45" x2="50" y2="115" stroke="${col}" stroke-width="1" opacity=".5"/>
      <line x1="32" y1="80" x2="68" y2="80" stroke="${col}" stroke-width="1" opacity=".5"/>
      <circle cx="50" cy="80" r="4" fill="${col}" opacity=".4"/>
    </svg>
  </div>`;
}

function categoryLabel(cat) {
  return { premium: 'Premium', standard: 'Standard', luxury: 'Luxury' }[cat] || 'Standard';
}

function cleanPhone(phone) {
  return (phone || '').replace(/\D/g, '');
}

function waText(p) {
  return encodeURIComponent(`Hello, I am interested in: ${p.name} (${p.price}). Please assist me.`);
}

/* ── Filter Buttons ── */
function setFilter(cat) {
  activeFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
  renderGallery();
}

/* ── Featured Section (Homepage) ── */
function renderFeatured() {
  const products = getProducts();
  const container = document.getElementById('featured-grid');
  if (!container) return;

  // Show up to 3 products (prefer luxury/premium)
  const sorted = [...products].sort((a, b) => {
    const order = { luxury: 0, premium: 1, standard: 2 };
    return (order[a.category] ?? 3) - (order[b.category] ?? 3);
  });
  const featured = sorted.slice(0, 3);

  container.innerHTML = '';
  featured.forEach(p => {
    const card = document.createElement('div');
    card.className = 'featured-card';
    card.innerHTML = `
      <div class="featured-img-wrap">${productImageHtml(p)}</div>
      <div class="featured-info">
        <div class="featured-cat">${categoryLabel(p.category)}</div>
        <div class="featured-name">${p.name}</div>
        <div class="featured-price">${p.price}</div>
        <button class="featured-cta" onclick="showPage('gallery')">View Collection →</button>
      </div>`;
    container.appendChild(card);
  });
}

/* ── Product Modal ── */
function openModal(id) {
  const products = getProducts();
  const p = products.find(x => String(x.id) === String(id));
  if (!p) return;

  document.getElementById('modal-img').innerHTML = productImageHtml(p);
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-cat').textContent = categoryLabel(p.category);
  document.getElementById('modal-price').textContent = p.price;
  document.getElementById('modal-desc').textContent = p.desc || 'No description provided.';
  document.getElementById('modal-call').href = `tel:${p.tel}`;
  document.getElementById('modal-wa').href = `https://wa.me/${cleanPhone(p.wa)}?text=${waText(p)}`;

  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Contact Form ── */
function submitForm() {
  const name    = document.getElementById('cf-name')?.value.trim();
  const phone   = document.getElementById('cf-phone')?.value.trim();
  const email   = document.getElementById('cf-email')?.value.trim();
  const message = document.getElementById('cf-message')?.value.trim();
  const errEl   = document.getElementById('form-error');
  const sucEl   = document.getElementById('form-success');

  // Reset
  if (errEl) errEl.style.display = 'none';
  if (sucEl) sucEl.style.display = 'none';

  // Validate
  const errors = [];
  if (!name || name.length < 2)              errors.push('Please enter your full name.');
  if (!phone || !/^[\d\s\+\-]{7,}$/.test(phone)) errors.push('Please enter a valid phone number.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address.');
  if (!message || message.length < 10)       errors.push('Please enter a message (at least 10 characters).');

  if (errors.length) {
    if (errEl) { errEl.innerHTML = errors.join('<br>'); errEl.style.display = 'block'; }
    return;
  }

  // Store message in localStorage
  const messages = getMessages();
  messages.push({ name, phone, email, message, date: new Date().toISOString(), read: false });
  localStorage.setItem('emma_messages', JSON.stringify(messages));

  // Clear form
  ['cf-name', 'cf-phone', 'cf-email', 'cf-message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  if (sucEl) sucEl.style.display = 'block';
}

/* ── Keyboard / Click to close modal ── */
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── On load ── */
document.addEventListener('DOMContentLoaded', () => {
  renderFeatured();
  renderGallery();
});
