/* script.js
   Full client-side logic:
   - demo products array
   - auth (signup/login) using localStorage
   - cart, wishlist (localStorage)
   - search, category, sort
   - counters animation, leaderboard, testimonials rotation
   - UI helpers (toast, modal, smooth scroll, dark mode)
*/

(() => {
  /* -------------------------
     Demo products (Indian names)
     ------------------------- */
  const DEMO_PRODUCTS = [
    { id: 'p1', name: 'NCERT Physics (Class 12) - Good', category: 'Books', price: 120, img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60' },
    { id: 'p2', name: 'Blue Kurta (M)', category: 'Clothes', price: 350, img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=60' },
    { id: 'p3', name: 'Used Laptop - Core i5', category: 'Electronics', price: 11500, img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60' },
    { id: 'p4', name: 'Wooden Study Table', category: 'Furniture', price: 2200, img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=60' },
    { id: 'p5', name: 'Mathematics Ref Book (R.S. Aggarwal)', category: 'Books', price: 90, img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=60' },
    { id: 'p6', name: 'Denim Jacket - Good Condition', category: 'Clothes', price: 600, img: 'https://images.unsplash.com/photo-1520975910177-6a2b1247f1b8?auto=format&fit=crop&w=800&q=60' },
    { id: 'p7', name: 'Smartphone (Worked Fine)', category: 'Electronics', price: 4200, img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60' },
    { id: 'p8', name: 'Office Chair - Ergonomic', category: 'Furniture', price: 1400, img: 'https://images.unsplash.com/photo-1589571894960-20bbe2828c44?auto=format&fit=crop&w=800&q=60' }
  ];

  /* -------------------------
     Simple localStorage helpers
     ------------------------- */
  const ls = {
    get: (k, fallback) => {
      try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set: (k, v) => {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ }
    }
  };

  /* -------------------------
     App state
     ------------------------- */
  let products = DEMO_PRODUCTS.slice();
  let filtered = products.slice();
  let cart = ls.get('rre_cart', []);
  let wishlist = ls.get('rre_wishlist', []);
  let users = ls.get('rre_users', []);
  let currentUser = ls.get('rre_user', null);

  /* UI elements */
  const productGrid = document.getElementById('productGrid');
  const resultCount = document.getElementById('resultCount');
  const cartBtn = document.getElementById('cartBtn');
  const cartCountNode = document.getElementById('cartCount');
  const wishCountNode = document.getElementById('wishCount');
  const cartPanel = document.getElementById('cartPanel');
  const cartItemsNode = document.getElementById('cartItems');
  const cartTotalNode = document.getElementById('cartTotal');
  const loginBtn = document.getElementById('loginBtn');
  const authArea = document.getElementById('authArea');
  const authModal = document.getElementById('authModal');
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const authMsg = document.getElementById('authMsg');
  const cartClose = document.getElementById('cartClose');
  const clearCartBtn = document.getElementById('clearCart');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const toastNode = document.getElementById('toast');
  const themeToggle = document.getElementById('themeToggle');
  const heroSearch = document.getElementById('heroSearch');
  const heroSearchBtn = document.getElementById('heroSearchBtn');
  const chips = document.querySelectorAll('.chip');
  const sortSelect = document.getElementById('sortSelect');
  const categoriesGrid = document.getElementById('categoriesGrid');
  const donorList = document.getElementById('donorList');
  const testimonialNode = document.getElementById('testimonial');
  const announcement = document.getElementById('announcement');
  const closeAnn = document.getElementById('closeAnn');

  /* -------------------------
     Utils
     ------------------------- */
  function showToast(msg, ms = 2200) {
    toastNode.textContent = msg;
    toastNode.classList.remove('hidden');
    setTimeout(() => toastNode.classList.add('hidden'), ms);
  }

  function saveState() {
    ls.set('rre_cart', cart);
    ls.set('rre_wishlist', wishlist);
    ls.set('rre_users', users);
    ls.set('rre_user', currentUser);
  }

  function formatPrice(n) { return new Intl.NumberFormat('en-IN').format(n); }

  /* -------------------------
     Render functions
     ------------------------- */
  function renderProducts(list) {
    productGrid.innerHTML = '';
    if (!list.length) {
      productGrid.innerHTML = `<div class="muted">No items match your search. Try another keyword or category.</div>`;
      resultCount.textContent = `Showing 0 items`;
      return;
    }
    resultCount.textContent = `Showing ${list.length} items`;
    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}" />
        <div class="product-body">
          <div class="cat">${p.category}</div>
          <div class="prod-title">${p.name}</div>
          <div class="prod-desc">Well looked after — connect with donor to pickup or schedule collection.</div>
          <div class="prod-actions">
            <div class="price">₹${formatPrice(p.price)}</div>
            <div class="actions">
              <button class="small-btn add-cart" data-id="${p.id}">Add</button>
              <button class="small-btn details" data-id="${p.id}">Details</button>
              <button class="small-btn wish" data-id="${p.id}">${wishlist.includes(p.id) ? '❤️' : '🤍'}</button>
            </div>
          </div>
        </div>
      `;
      productGrid.appendChild(card);
    });
    attachProductListeners();
  }

  function updateCounts() {
    const totalCount = cart.reduce((s,i) => s + i.qty, 0);
    cartCountNode.textContent = totalCount;
    wishCountNode.textContent = wishlist.length;
    cartTotalNode.textContent = calculateCartTotal();
  }

  function renderCart() {
    cartItemsNode.innerHTML = '';
    if (!cart.length) {
      cartItemsNode.innerHTML = `<div class="muted">Your cart is empty. Add items from Buy Back.</div>`;
      cartTotalNode.textContent = 0;
      return;
    }
    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div>
          <div style="font-weight:700">${item.name}</div>
          <div class="muted">₹${formatPrice(item.price)} × ${item.qty}</div>
        </div>
        <div style="text-align:right">
          <div style="margin-bottom:6px">₹${formatPrice(item.price * item.qty)}</div>
          <div>
            <button class="tiny" data-id="${item.id}" data-op="dec">-</button>
            <span style="padding:0 8px">${item.qty}</span>
            <button class="tiny" data-id="${item.id}" data-op="inc">+</button>
          </div>
          <div style="margin-top:6px">
            <button class="tiny-remove" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `;
      cartItemsNode.appendChild(row);
    });
    attachCartListeners();
    cartTotalNode.textContent = calculateCartTotal();
  }

  function renderCategories() {
    const cats = ['All', ...Array.from(new Set(products.map(p => p.category)))];
    categoriesGrid.innerHTML = '';
    cats.forEach(c => {
      const node = document.createElement('div');
      node.className = 'category-card';
      node.textContent = c;
      node.addEventListener('click', () => {
        applyCategory(c);
        window.location.hash = '#products';
      });
      categoriesGrid.appendChild(node);
    });
  }

  function renderLeaderboard() {
    // dummy donors
    const donors = [
      { name: 'Riya Sharma', items: 12 },
      { name: 'Aman Gupta', items: 9 },
      { name: 'Priya Singh', items: 8 },
      { name: 'Siddhant P.', items: 6 }
    ];
    donorList.innerHTML = donors.map(d => `<li><b>${d.name}</b> — ${d.items} items</li>`).join('');
  }

  function renderTestimonials() {
    const testimonials = [
      { who: 'Neha, Delhi', text: 'Saved ₹200 buying a reference book — quick pickup and friendly donor.' },
      { who: 'Karan, Pune', text: 'Donated old study materials — pickup was seamless and eco-friendly.' },
      { who: 'Meera, Mumbai', text: 'Found a laptop at great price — highly recommended!' }
    ];
    let idx = 0;
    function show() {
      testimonialNode.innerHTML = `<div style="font-weight:700">${testimonials[idx].who}</div><div class="muted">${testimonials[idx].text}</div>`;
      idx = (idx + 1) % testimonials.length;
    }
    show();
    setInterval(show, 4200);
  }

  /* -------------------------
     Product listeners
     ------------------------- */
  function attachProductListeners() {
    document.querySelectorAll('.add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const p = products.find(x => x.id === id);
        addToCart(p);
      });
    });
    document.querySelectorAll('.wish').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        toggleWishlist(id);
        renderProducts(filtered);
        updateCounts();
      });
    });
    document.querySelectorAll('.details').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const p = products.find(x => x.id === id);
        showToast(`${p.name} — ₹${formatPrice(p.price)} • Category: ${p.category}`);
      });
    });
  }

  /* -------------------------
     Cart listeners
     ------------------------- */
  function attachCartListeners() {
    cartPanel.querySelectorAll('.tiny').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const op = btn.dataset.op;
        if (op === 'inc') changeQty(id, 1);
        else changeQty(id, -1);
      });
    });
    cartPanel.querySelectorAll('.tiny-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        removeFromCart(id);
      });
    });
  }

  /* -------------------------
     Cart operations
     ------------------------- */
  function addToCart(product, qty = 1) {
    const idx = cart.findIndex(i => i.id === product.id);
    if (idx >= 0) cart[idx].qty += qty;
    else cart.push({ id: product.id, name: product.name, price: product.price, qty });
    saveState(); renderCart(); updateCounts();
    showToast('Added to cart');
  }

  function changeQty(id, delta) {
    const i = cart.find(x => x.id === id);
    if (!i) return;
    i.qty += delta;
    if (i.qty <= 0) cart = cart.filter(x => x.id !== id);
    saveState(); renderCart(); updateCounts();
  }

  function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    saveState(); renderCart(); updateCounts();
  }

  function clearCart() {
    cart = []; saveState(); renderCart(); updateCounts();
  }

  function calculateCartTotal() {
    return cart.reduce((s,i) => s + i.price * i.qty, 0);
  }

  /* -------------------------
     Wishlist
     ------------------------- */
  function toggleWishlist(id) {
    if (wishlist.includes(id)) wishlist = wishlist.filter(x => x !== id);
    else wishlist.push(id);
    saveState();
  }

  /* -------------------------
     Auth (simple / demo)
     ------------------------- */
  function openAuth() {
    authModal.classList.remove('hidden');
    showTab('login');
  }
  function closeAuth() {
    authModal.classList.add('hidden');
    authMsg.textContent = '';
  }
  function showTab(tab) {
    if (tab === 'login') {
      tabLogin.classList.add('active'); tabSignup.classList.remove('active');
      loginForm.classList.remove('hidden'); signupForm.classList.add('hidden');
    } else {
      tabSignup.classList.add('active'); tabLogin.classList.remove('active');
      signupForm.classList.remove('hidden'); loginForm.classList.add('hidden');
    }
  }
  function login(email, password) {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) { authMsg.textContent = 'Invalid email or password'; return false; }
    currentUser = { id: found.id, name: found.name, email: found.email };
    saveState(); updateAuthUI();
    showToast(`Welcome back, ${currentUser.name.split(' ')[0]}!`);
    return true;
  }
  function signup(name, email, password) {
    if (users.find(u => u.email === email)) { authMsg.textContent = 'Email already registered'; return false; }
    const newUser = { id: 'u' + Date.now(), name, email, password };
    users.push(newUser);
    currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    saveState(); updateAuthUI();
    showToast('Account created');
    return true;
  }
  function logout() {
    currentUser = null; saveState(); updateAuthUI();
    showToast('Logged out');
  }
  function updateAuthUI() {
    if (currentUser) {
      authArea.innerHTML = `<div class="user-area">Hi, <b>${currentUser.name.split(' ')[0]}</b> • <button id="logoutBtn" class="link-btn">Logout</button></div>`;
      document.getElementById('logoutBtn').addEventListener('click', () => logout());
    } else {
      authArea.innerHTML = `<button id="loginBtn" class="primary-btn">Login / Sign up</button>`;
      document.getElementById('loginBtn').addEventListener('click', openAuth);
    }
  }

  /* -------------------------
     Search / Filter / Sort
     ------------------------- */
  function applySearch(q) {
    const t = q.trim().toLowerCase();
    filtered = products.filter(p => p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t));
    applySort();
    renderProducts(filtered);
    updateCounts();
  }
  function applyCategory(cat) {
    if (cat === 'All') filtered = products.slice();
    else filtered = products.filter(p => p.category === cat);
    applySort();
    renderProducts(filtered);
  }
  function applySort() {
    const v = sortSelect.value;
    if (v === 'price-asc') filtered.sort((a,b) => a.price - b.price);
    else if (v === 'price-desc') filtered.sort((a,b) => b.price - a.price);
    else filtered.sort((a,b) => a.name.localeCompare(b.name));
  }

  /* -------------------------
     UI wiring
     ------------------------- */
  // initial render
  function init() {
    renderCategories();
    filtered = products.slice();
    renderProducts(filtered);
    renderCart();
    updateCounts();
    renderLeaderboard();
    renderTestimonials();
    updateAuthUI();
    animateCounters();

    // search bindings
    heroSearchBtn.addEventListener('click', () => applySearch(heroSearch.value));
    document.getElementById('searchInput').addEventListener('keyup', (e) => {
      if (e.key === 'Enter') applySearch(e.target.value);
    });

    // chips
    chips.forEach(c => c.addEventListener('click', () => {
      const cat = c.dataset.cat; applyCategory(cat);
    }));
    sortSelect.addEventListener('change', () => { applySort(); renderProducts(filtered); });

    // cart open/close
    cartBtn.addEventListener('click', () => {
      cartPanel.classList.toggle('open');
      cartPanel.classList.contains('open') ? cartPanel.style.display = 'block' : cartPanel.style.display = 'none';
    });
    cartClose.addEventListener('click', () => { cartPanel.classList.remove('open'); cartPanel.style.display = 'none'; });

    // clear / checkout
    clearCartBtn.addEventListener('click', () => { clearCart(); showToast('Cart cleared'); });
    checkoutBtn.addEventListener('click', () => {
      if (!currentUser) { openAuth(); showToast('Please login to checkout'); return; }
      if (!cart.length) { showToast('Cart is empty'); return; }
      // demo checkout
      const totalItems = cart.reduce((s,i) => s + i.qty, 0);
      let itemsDonated = ls.get('rre_itemsDonated', 650);
      ls.set('rre_itemsDonated', itemsDonated + totalItems);
      cart = []; saveState(); renderCart(); updateCounts();
      showToast('Checkout successful — demo');
    });

    // auth modal wiring
    document.getElementById('loginBtn')?.addEventListener('click', openAuth);
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
      document.getElementById('mobileNav').classList.toggle('open');
    });

    tabLogin.addEventListener('click', () => showTab('login'));
    tabSignup.addEventListener('click', () => showTab('signup'));
    document.getElementById('authClose').addEventListener('click', closeAuth);

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      if (login(email, password)) closeAuth();
    });
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      if (password.length < 6) { authMsg.textContent = 'Password must be 6+ chars'; return; }
      if (signup(name, email, password)) closeAuth();
    });

    // contact form
    document.getElementById('contactForm').addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thanks — message received (demo)');
      document.getElementById('contactForm').reset?.();
    });

    // toast initial hide
    toastNode.classList.add('hidden');

    // theme toggle
    const darkPref = ls.get('rre_dark', false);
    if (darkPref) document.documentElement.classList.add('dark');
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      ls.set('rre_dark', document.documentElement.classList.contains('dark'));
    });

    // hero search shortcut
    document.getElementById('heroSearch').addEventListener('keyup', (e) => { if (e.key === 'Enter') applySearch(e.target.value); });
    document.getElementById('heroSearchBtn').addEventListener('click', () => applySearch(heroSearch.value));

    // how it works
    document.getElementById('howItWorksBtn').addEventListener('click', () => {
      showToast('Demo: Fill pickup form → we match a nearby recipient → schedule collection.');
    });

    // close announcement
    closeAnn.addEventListener('click', () => announcement.style.display = 'none');

    // sticky header shadow on scroll
    window.addEventListener('scroll', () => {
      const hdr = document.getElementById('siteHeader');
      if (window.scrollY > 10) hdr.style.boxShadow = '0 6px 26px rgba(12,14,20,0.08)';
      else hdr.style.boxShadow = '0 2px 8px rgba(15,23,42,0.04)';
    });

    // smooth scroll for nav links
    document.querySelectorAll('.nav-link, .mobile-link, .brand-title, .footer-link').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // initialize persisted counters if present
    const storedItems = ls.get('rre_itemsDonated', 650);
    document.getElementById('itemsDonated').dataset.target = storedItems;
    animateCounters();
  }

  /* -------------------------
     Counters animation
     ------------------------- */
  function animateCounters() {
    document.querySelectorAll('.stat-value').forEach(node => {
      const target = parseInt(node.dataset.target || node.textContent.replace(/,/g,''), 10);
      let start = Math.floor(target * 0.8);
      if (start < 0) start = 0;
      const step = Math.max(1, Math.floor((target - start) / 30));
      node.textContent = start;
      const t = setInterval(() => {
        start += step;
        if (start >= target) { node.textContent = target; clearInterval(t); }
        else node.textContent = start;
      }, 20);
    });
  }

  /* -------------------------
     Small helpers & boot
     ------------------------- */
  function calculateTotalsAndRender() {
    renderCart(); updateCounts();
  }

  // initialize app
  init();
  calculateTotalsAndRender();

  // expose some for debugging (optional)
  window._rre = {
    addToCart, removeFromCart, cart, wishlist, products, applySearch
  };
})();
