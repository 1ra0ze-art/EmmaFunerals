  function getProducts() {
    return JSON.parse(localStorage.getItem('emma_products') || '[]');
  }
  function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.getElementById('page-' + id).classList.add('active');
    document.getElementById('nav-' + id).classList.add('active');
    window.scrollTo(0, 0);
    if (id === 'gallery') renderGallery();
  }
  function renderGallery() {
    const products = getProducts();
    const grid = document.getElementById('product-grid');
    const empty = document.getElementById('gallery-empty');
    grid.innerHTML = '';
    if (!products.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    products.forEach(p => {
      const waMsg = encodeURIComponent('Hello, I am interested in: ' + p.name + ' (' + p.price + ')');
      const imgHtml = p.img ? `<img src="${p.img}" alt="${p.name}" onerror="this.parentElement.innerHTML='<div class=product-no-img>⚰</div>'">` : '<div class="product-no-img">⚰</div>';
      grid.innerHTML += `<div class="product-card"><div class="product-img-wrap">${imgHtml}</div><div class="product-info"><div class="product-name">${p.name}</div><div class="product-price">${p.price}</div><div class="product-desc">${p.desc}</div><div class="product-btns"><a class="btn-call" href="tel:${p.tel}">📞 Call</a><a class="btn-chat" href="https://wa.me/${p.wa.replace(/\D/g,'')}?text=${waMsg}" target="_blank">💬 WhatsApp</a></div></div></div>`;
    });
  }
  function submitForm() {
    document.getElementById('form-success').style.display = 'block';
  }
  renderGallery();