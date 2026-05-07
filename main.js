  // ── Data ──
  let cart = [];
  let currentProduct = null;
  let slideIndex = 0;

  function getProducts() { return JSON.parse(localStorage.getItem('emma_products') || '[]'); }

  // ── Navigation ──
  function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.getElementById('page-' + id).classList.add('active');
    document.getElementById('nav-' + id).classList.add('active');
    window.scrollTo(0, 0);
    if (id === 'gallery') renderGallery();
  }

  // ── Gallery ──
  function renderGallery() {
    const products = getProducts();
    const grid = document.getElementById('product-grid');
    const empty = document.getElementById('market-empty');
    const count = document.getElementById('market-count');
    grid.innerHTML = '';
    count.textContent = products.length + ' product' + (products.length !== 1 ? 's' : '');
    if (!products.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    products.forEach((p, i) => {
      const thumb = p.imgs && p.imgs[0] ? `<img src="${p.imgs[0]}" alt="${p.name}" onerror="this.parentElement.innerHTML='<div class=pc-no-img>⚰</div>'">` : '<div class="pc-no-img">⚰</div>';
      grid.innerHTML += `
        <div class="product-card" onclick="openModal(${i})">
          <div class="pc-img">
            ${thumb}
            <div class="pc-badge">In Stock</div>
          </div>
          <div class="pc-body">
            <div class="pc-name">${p.name}</div>
            <div class="pc-price">${p.price}</div>
            <div class="pc-desc">${p.desc || 'Click to see full details.'}</div>
            <div class="pc-footer">
              <span class="pc-view">View Details →</span>
              <button class="pc-cart-mini" onclick="event.stopPropagation();quickAdd(${i})" title="Quick add to cart">🛒</button>
            </div>
          </div>
        </div>`;
    });
  }

  // ── Product Modal ──
  function openModal(i) {
    const products = getProducts();
    const p = products[i];
    if (!p) return;
    currentProduct = p;
    slideIndex = 0;

    document.getElementById('modal-name').textContent = p.name;
    document.getElementById('modal-price').textContent = p.price;
    document.getElementById('modal-desc').textContent = p.desc || 'No description available.';

    const waMsg = encodeURIComponent('Hello, I am interested in: ' + p.name + ' (' + p.price + ')');
    document.getElementById('modal-wa').href = 'https://wa.me/' + (p.wa || '').replace(/\D/g,'') + '?text=' + waMsg;
    document.getElementById('modal-call').href = 'tel:' + (p.tel || '');

    // Slideshow
    const slides = document.getElementById('modal-slides');
    const imgs = (p.imgs || []).filter(Boolean);
    if (!imgs.length) {
      slides.innerHTML = '<div class="slide active"><div class="slide-no-img">⚰</div></div>';
    } else {
      slides.innerHTML = imgs.map((src, idx) =>
        `<div class="slide ${idx===0?'active':''}">
          <img src="${src}" alt="${p.name} ${idx+1}" onerror="this.parentElement.innerHTML='<div class=slide-no-img>⚰</div>'">
        </div>`).join('');
      if (imgs.length > 1) {
        slides.innerHTML += `
          <button class="slide-prev" onclick="moveSlide(-1)">‹</button>
          <button class="slide-next" onclick="moveSlide(1)">›</button>
          <div class="slide-arrows">${imgs.map((_,idx)=>`<button class="slide-dot ${idx===0?'active':''}" onclick="goSlide(${idx})"></button>`).join('')}</div>`;
      }
    }

    document.getElementById('modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function moveSlide(dir) {
    const slides = document.querySelectorAll('#modal-slides .slide');
    const dots = document.querySelectorAll('#modal-slides .slide-dot');
    slides[slideIndex].classList.remove('active');
    if (dots[slideIndex]) dots[slideIndex].classList.remove('active');
    slideIndex = (slideIndex + dir + slides.length) % slides.length;
    slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
  }

  function goSlide(i) {
    const slides = document.querySelectorAll('#modal-slides .slide');
    const dots = document.querySelectorAll('#modal-slides .slide-dot');
    slides[slideIndex].classList.remove('active');
    if (dots[slideIndex]) dots[slideIndex].classList.remove('active');
    slideIndex = i;
    slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
  }

  function closeModal(e) { if (e.target === document.getElementById('modal-overlay')) closeModalDirect(); }
  function closeModalDirect() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Cart ──
  function addToCartFromModal() {
    if (!currentProduct) return;
    cart.push({ ...currentProduct });
    updateCartCount();
    closeModalDirect();
    openCart();
  }

  function quickAdd(i) {
    const products = getProducts();
    cart.push({ ...products[i] });
    updateCartCount();
    openCart();
  }

  function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
  }

  function openCart() {
    renderCart();
    document.getElementById('cart-overlay').classList.add('open');
  }

  function closeCart() {
    document.getElementById('cart-overlay').classList.remove('open');
  }

  function renderCart() {
    const container = document.getElementById('cart-items');
    const foot = document.getElementById('cart-foot');
    if (!cart.length) {
      container.innerHTML = '<div class="cart-empty-msg"><p>Your cart is empty.</p></div>';
      foot.style.display = 'none';
      return;
    }
    container.innerHTML = cart.map((p, i) => {
      const thumb = p.imgs && p.imgs[0]
        ? `<img class="cart-item-img" src="${p.imgs[0]}" alt="${p.name}">`
        : '<div class="cart-item-img-empty">⚰</div>';
      return `<div class="cart-item">
        ${thumb}
        <div style="flex:1">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">${p.price}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
      </div>`;
    }).join('');
    foot.style.display = 'block';
    document.getElementById('cart-total-val').textContent = cart.length + ' item' + (cart.length !== 1 ? 's' : '') + ' — contact for total';
  }

  function removeFromCart(i) {
    cart.splice(i, 1);
    updateCartCount();
    renderCart();
  }

  function cartCheckout() {
    if (!cart.length) return;
    const lines = cart.map(p => '• ' + p.name + ' (' + p.price + ')').join('\n');
    const msg = encodeURIComponent('Hello Emma Funeral Services,\n\nI would like to order:\n' + lines + '\n\nPlease assist.');
    const wa = cart[0].wa ? cart[0].wa.replace(/\D/g,'') : '250788000000';
    window.open('https://wa.me/' + wa + '?text=' + msg, '_blank');
  }

  // ── Contact ──
  function submitContact() {
    document.getElementById('c-success').style.display = 'block';
  }

  updateCartCount();
 renderGallery();