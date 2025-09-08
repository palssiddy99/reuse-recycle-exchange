// Simple client-side app: stores items in localStorage
const STORAGE_KEY = 'rre_items_v1';

const sampleItems = [
  { id: genId(), title: "Old Textbooks", description: "Math & Physics, good condition", category: "Books", condition: "Good", contact: "student@college.edu", image: "", claimed: false, created: Date.now() - 1000*60*60*24 },
  { id: genId(), title: "Study Table", description: "Wooden table, some marks", category: "Furniture", condition: "Fair", contact: "9876543210", image: "", claimed: false, created: Date.now() - 1000*60*60*48 },
];

let items = loadItems();

const el = {
  itemsGrid: document.getElementById('itemsGrid'),
  openAddBtn: document.getElementById('openAddBtn'),
  modal: document.getElementById('modal'),
  closeModal: document.getElementById('closeModal'),
  itemForm: document.getElementById('itemForm'),
  searchInput: document.getElementById('searchInput'),
  categoryFilter: document.getElementById('categoryFilter'),
  sortSelect: document.getElementById('sortSelect'),
  loadSample: document.getElementById('loadSample'),
  cancelAdd: document.getElementById('cancelAdd'),
  imageFile: document.getElementById('imageFile'),
  yearSpan: document.getElementById('year')
};

el.yearSpan.textContent = new Date().getFullYear();

function genId(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}

function loadItems(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return JSON.parse(raw);
  } catch(e){}
  return []; // start empty; sample load on request
}

function saveItems(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function renderList(){
  // build categories
  const categories = Array.from(new Set(items.map(i => i.category))).filter(Boolean);
  populateCategoryFilter(categories);

  const search = el.searchInput.value.trim().toLowerCase();
  const cat = el.categoryFilter.value;
  const sort = el.sortSelect.value;

  let filtered = items.filter(it => {
    if(cat && it.category !== cat) return false;
    if(!search) return true;
    return (it.title + ' ' + it.description + ' ' + it.category).toLowerCase().includes(search);
  });

  if(sort === 'newest') filtered.sort((a,b)=>b.created - a.created);
  else if(sort === 'oldest') filtered.sort((a,b)=>a.created - b.created);
  else if(sort === 'condition') filtered.sort((a,b)=> (a.condition > b.condition) ? -1:1);

  el.itemsGrid.innerHTML = filtered.map(makeCardHtml).join('') || `<div class="card">No items yet. Click "Add Item" to create one.</div>`;

  // attach event listeners using delegation
  document.querySelectorAll('.claim-btn').forEach(btn => {
    btn.onclick = () => toggleClaim(btn.dataset.id);
  });
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = () => deleteItem(btn.dataset.id);
  });
}

function populateCategoryFilter(categories){
  const sel = el.categoryFilter;
  // keep default option then add categories
  const existing = Array.from(sel.options).slice(1).map(o=>o.value);
  // add any new categories from items
  categories.forEach(cat=>{
    if(!existing.includes(cat)){
      const opt = document.createElement('option');
      opt.value = cat; opt.textContent = cat;
      sel.appendChild(opt);
    }
  });
}

function makeCardHtml(it){
  const img = it.image ? `<img class="item-img" src="${it.image}" alt="${escapeHtml(it.title)}">` : `<div style="height:160px;border-radius:8px;background:#eef5ee;display:flex;align-items:center;justify-content:center;color:#6a8e6a">No image</div>`;
  return `
  <article class="card">
    ${img}
    <div class="item-title">${escapeHtml(it.title)}</div>
    <div class="item-meta">${escapeHtml(it.description)}</div>
    <div style="margin-top:.6rem">
      <span class="badge">${escapeHtml(it.category)}</span>
      <span style="margin-left:.4rem;color:var(--muted)">${escapeHtml(it.condition)}</span>
    </div>
    <div class="actions">
      <button class="btn claim-btn" data-id="${it.id}">${it.claimed ? 'Unclaim' : 'Claim'}</button>
      <button class="btn" onclick="window.location='mailto:${encodeURIComponent(it.contact)}'">Contact</button>
      <button class="btn delete-btn" data-id="${it.id}">Delete</button>
    </div>
  </article>`;
}

function toggleClaim(id){
  const idx = items.findIndex(i=>i.id===id);
  if(idx>=0){
    items[idx].claimed = !items[idx].claimed;
    saveItems(); renderList();
  }
}

function deleteItem(id){
  if(!confirm('Delete this item?')) return;
  items = items.filter(i=>i.id!==id);
  saveItems(); renderList();
}

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// Modal handlers
el.openAddBtn.onclick = ()=> openModal();
el.closeModal.onclick = closeModal;
el.cancelAdd.onclick = closeModal;
el.loadSample.onclick = ()=>{ items = sampleItems.concat(items); saveItems(); renderList(); alert('Sample items loaded'); };

el.itemForm.onsubmit = async (e) => {
  e.preventDefault();
  const form = new FormData(el.itemForm);
  const title = form.get('title').trim();
  const description = form.get('description').trim();
  const category = form.get('category');
  const condition = form.get('condition');
  const contact = form.get('contact').trim();
  const imageUrl = form.get('imageUrl').trim();

  // prefer uploaded file -> convert to base64
  let image = imageUrl || '';
  const file = el.imageFile.files && el.imageFile.files[0];
  if(file){
    image = await toBase64(file);
  }

  const newItem = {
    id: genId(),
    title, description, category, condition, contact, image, claimed: false, created: Date.now()
  };
  items.unshift(newItem);
  saveItems();
  el.itemForm.reset();
  closeModal();
  renderList();
};

function toBase64(file){
  return new Promise((res, rej)=>{
    const reader = new FileReader();
    reader.onload = ()=> res(reader.result.toString());
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

function openModal(){
  el.modal.classList.remove('hidden');
}
function closeModal(){
  el.modal.classList.add('hidden');
}

// filters events
el.searchInput.oninput = renderList;
el.categoryFilter.onchange = renderList;
el.sortSelect.onchange = renderList;

// keyboard close modal with Escape
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

// initial render
renderList();
