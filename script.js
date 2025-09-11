/* script.js
   - Dark mode with persistence
   - Cart (add/remove/update) with cart panel
   - Wishlist toggle
   - Auth modal (demo) with nav user display & logout
   - Reveal-on-scroll animations
   - Search, category, sort
   - Counters, leaderboard, testimonials
   - Contact form success toast
*/

/* -------------------------
   Demo product data
   ------------------------- */
const DEMO_PRODUCTS = [
  { id: 'p1', name: 'NCERT Physics (Class 12)', category: 'Books', price: 120, img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60' },
  { id: 'p2', name: 'Blue Kurta - M', category: 'Clothes', price: 350, img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=60' },
  { id: 'p3', name: 'Used Laptop - Core i5', category: 'Electronics', price: 11500, img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60' },
  { id: 'p4', name: 'Wooden Study Table', category: 'Furniture', price: 2200, img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=60' },
  { id: 'p5', name: 'Math Reference (R.S. Aggarwal)', category: 'Books', price: 90, img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=60' },
  { id: 'p6', name: 'Denim Jacket - Good', category: 'Clothes', price: 600, img: 'https://images.unsplash.com/photo-1520975910177-6a2b1247f1b8?auto=format&fit=crop&w=800&q=60' },
  { id: 'p7', name: 'Smartphone (Working)', category: 'Electronics', price: 4200, img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60' },
  { id: 'p8', name: 'Office Chair - Ergonomic', category: 'Furniture', price: 1400, img: 'https://images.unsplash.com/photo-1589571894960-20bbe2828c44?auto=format&fit=crop&w=800&q=60' }
];

/* -------------------------
   Local storage helpers
   ------------------------- */
const ls = {
  get: (k, def) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; }
    catch { return def; }
  },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
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

/* -------------------------
   DOM refs
   ------------------------- */
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
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

/* -------------------------
   Helpers
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
function formatPrice(n){ return new Intl.NumberFormat('en-IN').format(n); }

/* -------------------------
   Render products
   ------------------------- */
function renderProducts(list){
  productGrid.innerHTML = '';
  if(!list.length){ productGrid.innerHTML = `<div class="muted">No items found.</div>`; resultCount.textContent = `Showing 0 items`; return; }
  resultCount.textContent = `Showing ${list.length} items`;
  list.forEach(p=>{
    const el = document.createElement('div'); el.className='product-card reveal';
    el.innerHTML = `
      <button class="wishlist-btn" data-id="${p.id}" title="Save to wishlist" aria-label="Save to wishlist"> ${wishlist.includes(p.id)?'❤️':'🤍'} </button>
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="product-body">
        <div class="cat">${p.category}</div>
        <div class="prod-title">${p.name}</div>
        <div class="prod-desc">Well-cared item — schedule pickup or collection.</div>
        <div class="prod-actions">
          <div class="price">₹${formatPrice(p.price)}</div>
          <div>
            <button class="small-btn add-cart" data-id="${p.id}">Add</button>
            <button class="small-btn details" data-id="${p.id}">Details</button>
          </div>
        </div>
      </div>
    `;
    productGrid.appendChild(el);
  });
  attachProductListeners();
  revealAll(); // animate
}

/* -------------------------
   Cart functions
   ------------------------- */
function updateCounts(){
  const totalCount = cart.reduce((s,i)=>s+i.qty,0);
  cartCountNode.textContent = totalCount;
  wishCountNode.textContent = wishlist.length;
  cartTotalNode.textContent = calculateCartTotal();
}
function renderCart(){
  cartItemsNode.innerHTML='';
  if(!cart.length){ cartItemsNode.innerHTML = `<div class="muted">Your cart is empty.</div>`; cartTotalNode.textContent = 0; return; }
  cart.forEach(item=>{
    const row = document.createElement('div'); row.className='cart-item';
    row.innerHTML = `
      <div style="flex:1">
        <div style="font-weight:700">${item.name}</div>
        <div class="muted">₹${formatPrice(item.price)} × ${item.qty}</div>
      </div>
      <div style="text-align:right">
        <div style="margin-bottom:8px">₹${formatPrice(item.price*item.qty)}</div>
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
function addToCart(productId, qty=1){
  const p = products.find(x=>x.id===productId); if(!p) return;
  const idx = cart.findIndex(i=>i.id===p.id);
  if(idx>=0) cart[idx].qty += qty; else cart.push({id:p.id,name:p.name,price:p.price,qty});
  saveState(); renderCart(); updateCounts(); showToast('Added to cart');
}
function changeQty(id,delta){
  const i = cart.find(x=>x.id===id); if(!i) return;
  i.qty += delta; if(i.qty<=0) cart = cart.filter(x=>x.id!==id);
  saveState(); renderCart(); updateCounts();
}
function removeFromCart(id){ cart = cart.filter(x=>x.id!==id); saveState(); renderCart(); updateCounts(); }
function clearCart(){ cart = []; saveState(); renderCart(); updateCounts(); showToast('Cart cleared'); }
function calculateCartTotal(){ return cart.reduce((s,i)=>s+i.price*i.qty,0); }

/* -------------------------
   Wishlist
   ------------------------- */
function toggleWishlist(id, btn){
  if(wishlist.includes(id)){ wishlist = wishlist.filter(x=>x!==id); btn.textContent = '🤍'; btn.classList.remove('active'); showToast('Removed from wishlist'); }
  else { wishlist.push(id); btn.textContent = '❤️'; btn.classList.add('active'); showToast('Saved to wishlist'); }
  saveState(); updateCounts();
}

/* -------------------------
   Auth (demo)
   ------------------------- */
function openAuth(){ authModal.classList.remove('hidden'); authModal.setAttribute('aria-hidden','false'); showTab('login'); }
function closeAuth(){ authModal.classList.add('hidden'); authModal.setAttribute('aria-hidden','true'); authMsg.textContent=''; }
function showTab(tab){
  if(tab==='login'){ tabLogin.classList.add('active'); tabSignup.classList.remove('active'); loginForm.classList.remove('hidden'); signupForm.classList.add('hidden');}
  else { tabSignup.classList.add('active'); tabLogin.classList.remove('active'); signupForm.classList.remove('hidden'); loginForm.classList.add('hidden'); }
}
function login(email,password){
  const found = users.find(u=>u.email===email && u.password===password);
  if(!found){ authMsg.textContent='Invalid credentials'; return false; }
  currentUser = {id:found.id,name:found.name,email:found.email}; saveState(); updateAuthUI(); showToast(`Welcome back, ${currentUser.name.split(' ')[0]}`); return true;
}
function signup(name,email,password){
  if(users.find(u=>u.email===email)){ authMsg.textContent='Email already registered'; return false; }
  const newUser = {id:'u'+Date.now(),name,email,password}; users.push(newUser); currentUser = {id:newUser.id,name:newUser.name,email:newUser.email}; saveState(); updateAuthUI(); showToast('Account created'); return true;
}
function logout(){ currentUser=null; saveState(); updateAuthUI(); showToast('Logged out'); }
function updateAuthUI(){
  if(currentUser){
    authArea.innerHTML = `<div class="user-area">Hi, <b>${currentUser.name.split(' ')[0]}</b> • <button id="logoutBtn" class="link-btn">Logout</button></div>`;
    document.getElementById('logoutBtn').addEventListener('click', logout);
  } else {
    authArea.innerHTML = `<button id="loginBtn" class="primary-btn">Login / Sign up</button>`;
    document.getElementById('loginBtn').addEventListener('click', openAuth);
  }
}

/* -------------------------
   Attach listeners (products/cart)
   ------------------------- */
function attachProductListeners(){
  document.querySelectorAll('.add-cart').forEach(btn=>{ btn.onclick = ()=> addToCart(btn.dataset.id); });
  document.querySelectorAll('.details').forEach(btn=>{ btn.onclick = ()=> {
    const p = products.find(x=>x.id===btn.dataset.id); showToast(`${p.name} • ₹${formatPrice(p.price)} • ${p.category}`,3000);
  }});
  document.querySelectorAll('.wishlist-btn').forEach(btn=>{
    btn.onclick = ()=> toggleWishlist(btn.dataset.id, btn);
    // mark active
    const id = btn.dataset.id; if(wishlist.includes(id)){ btn.classList.add('active'); btn.textContent='❤️'; }
  });
}

/* -------------------------
   Cart listeners
   ------------------------- */
function attachCartListeners(){
  cartPanel.querySelectorAll('.tiny').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const id = btn.dataset.id; const op = btn.dataset.op;
      op==='inc' ? changeQty(id,1) : changeQty(id,-1);
    });
  });
  cartPanel.querySelectorAll('.tiny-remove').forEach(btn=> btn.addEventListener('click', ()=> removeFromCart(btn.dataset.id)));
}

/* -------------------------
   Search / Category / Sort
   ------------------------- */
function applySearch(q){
  const t = q.trim().toLowerCase();
  filtered = products.filter(p => p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t));
  applySort(); renderProducts(filtered); updateCounts();
}
function applyCategory(cat){
  filtered = (cat==='All') ? products.slice() : products.filter(p=>p.category===cat);
  applySort(); renderProducts(filtered); updateCounts();
}
function applySort(){
  const v = sortSelect.value;
  if(v==='price-asc') filtered.sort((a,b)=>a.price-b.price);
  else if(v==='price-desc') filtered.sort((a,b)=>b.price-a.price);
  else filtered.sort((a,b)=>a.name.localeCompare(b.name));
}

/* -------------------------
   Leaderboard & testimonials
   ------------------------- */
function renderLeaderboard(){
  const donors = [{name:'Riya Sharma',items:12},{name:'Aman Gupta',items:9},{name:'Priya Singh',items:8}];
  donorList.innerHTML = donors.map(d=>`<li><b>${d.name}</b> — ${d.items} items</li>`).join('');
}
function renderTestimonials(){
  const testimonials = [{who:'Neha, Delhi',text:'Saved ₹200 buying a reference book — quick pickup.'},{who:'Karan, Pune',text:'Donated old materials — pickup was seamless.'},{who:'Meera, Mumbai',text:'Found a laptop at great price — highly recommended!'}];
  let idx=0;
  function show(){ testimonialNode.innerHTML = `<div class="testimonial-card"><p>"${testimonials[idx].text}"</p><h4>— ${testimonials[idx].who}</h4></div>`; idx=(idx+1)%testimonials.length; }
  show(); setInterval(show,4200);
}

/* -------------------------
   Counters (animate)
   ------------------------- */
function animateCounters(){
  document.querySelectorAll('.stat-value').forEach(node=>{
    const target = parseInt(node.dataset.target||node.textContent.replace(/,/g,''),10);
    let start = Math.floor(target*0.75);
    if(start<0) start=0;
    const step = Math.max(1,Math.floor((target-start)/30));
    node.textContent = start;
    const t = setInterval(()=>{
      start += step;
      if(start>=target){ node.textContent = target.toLocaleString(); clearInterval(t); }
      else node.textContent = start.toLocaleString();
    },20);
  });
}

/* -------------------------
   Reveal on scroll
   ------------------------- */
function revealAll(){
  document.querySelectorAll('.reveal').forEach(el=>{
    if(el.classList.contains('visible')) return;
    const rect = el.getBoundingClientRect();
    if(rect.top < (window.innerHeight - 80)){
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealAll);
window.addEventListener('resize', revealAll);

/* -------------------------
   Dark mode
   ------------------------- */
function initDarkMode(){
  const darkPref = ls.get('rre_dark', false);
  if(darkPref) document.documentElement.classList.add('dark'), themeToggle.setAttribute('aria-pressed','true');
  themeToggle.addEventListener('click', ()=>{
    const isDark = document.documentElement.classList.toggle('dark');
    ls.set('rre_dark', isDark);
    themeToggle.setAttribute('aria-pressed', String(isDark));
    showToast(isDark? 'Dark mode on':'Light mode on');
  });
}

/* -------------------------
   UI wiring and boot
   ------------------------- */
function initUI(){
  // categories
  const cats = ['All',...Array.from(new Set(products.map(p=>p.category)))];
  categoriesGrid.innerHTML = '';
  cats.forEach(c=>{ const d=document.createElement('div'); d.className='category-card'; d.textContent=c; d.onclick=()=>{applyCategory(c); window.location.hash='#products'}; categoriesGrid.appendChild(d); });

  // initial render
  filtered = products.slice(); renderProducts(filtered); renderCart(); updateCounts(); renderLeaderboard(); renderTestimonials(); animateCounters();

  // search
  heroSearchBtn.addEventListener('click', ()=> applySearch(heroSearch.value));
  document.getElementById('searchInput').addEventListener('keyup', e=>{ if(e.key==='Enter') applySearch(e.target.value); });

  // chips
  chips.forEach(c=> c.addEventListener('click', ()=> applyCategory(c.dataset.cat)));

  // sort
  sortSelect.addEventListener('change', ()=>{ applySort(); renderProducts(filtered); });

  // cart open/close
  cartBtn.addEventListener('click', ()=> { cartPanel.classList.toggle('open'); cartPanel.classList.contains('open')?cartPanel.style.display='block':cartPanel.style.display='none'; });
  cartClose.addEventListener('click', ()=> { cartPanel.classList.remove('open'); cartPanel.style.display='none'; });

  // clear/checkout
  clearCartBtn.addEventListener('click', ()=> clearCart());
  checkoutBtn.addEventListener('click', ()=> {
    if(!currentUser){ openAuth(); showToast('Please login to checkout'); return; }
    if(!cart.length){ showToast('Cart is empty'); return; }
    // demo checkout
    const totalItems = cart.reduce((s,i)=>s+i.qty,0);
    let itemsDonated = ls.get('rre_itemsDonated',650);
    ls.set('rre_itemsDonated', itemsDonated + totalItems);
    cart=[]; saveState(); renderCart(); updateCounts(); showToast('Checkout successful — demo');
  });

  // auth modal
  document.getElementById('loginBtn')?.addEventListener('click', openAuth);
  mobileMenuBtn?.addEventListener('click', ()=> { const open = mobileNav.classList.toggle('open'); mobileMenuBtn.setAttribute('aria-expanded', String(open)); });

  tabLogin.addEventListener('click', ()=> showTab('login'));
  tabSignup.addEventListener('click', ()=> showTab('signup'));
  document.getElementById('authClose').addEventListener('click', closeAuth);

  loginForm.addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if(login(email,password)) closeAuth();
  });
  signupForm.addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    if(password.length < 6){ authMsg.textContent = 'Password must be 6+ chars'; return; }
    if(signup(name,email,password)) closeAuth();
  });

  // contact form
  document.getElementById('contactForm').addEventListener('submit', e=>{
    e.preventDefault();
    showToast('Message sent — we will contact you soon!');
    document.getElementById('contactForm').reset?.();
  });

  // announcement close
  closeAnn?.addEventListener('click', ()=> announcement.style.display='none');

  // nav highlight on scroll (simple)
  const sections = document.querySelectorAll('main section[id]');
  window.addEventListener('scroll', ()=>{
    let current = null;
    sections.forEach(s=>{ const top = s.getBoundingClientRect().top; if(top <= 120) current = s.id; });
    document.querySelectorAll('.nav-link').forEach(a=> a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
  });

  // persist dark mode and UI
  initDarkMode();
  updateAuthUI();

  // small reveal initial
  setTimeout(revealAll, 120);
}

/* -------------------------
   Attach product listeners after DOM injection
   ------------------------- */
function attachProductListeners(){ // already defined earlier, keep safe
  document.querySelectorAll('.add-cart').forEach(btn=>{ btn.onclick = ()=> addToCart(btn.dataset.id) });
  document.querySelectorAll('.details').forEach(btn=>{ btn.onclick = ()=> {
    const p = products.find(x=>x.id===btn.dataset.id); showToast(`${p.name} • ₹${formatPrice(p.price)} • ${p.category}`, 2800);
  }});
  document.querySelectorAll('.wishlist-btn').forEach(btn=>{
    btn.onclick = ()=> toggleWishlist(btn.dataset.id, btn);
    const id = btn.dataset.id; if(wishlist.includes(id)){ btn.classList.add('active'); btn.textContent='❤️'; }
  });
}

/* -------------------------
   Init app
   ------------------------- */
document.addEventListener('DOMContentLoaded', ()=> {
  initUI();
  updateCounts();
  // expose for debug
  window._rre = { addToCart, cart, wishlist, products, applySearch };
});
