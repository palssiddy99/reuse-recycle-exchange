// ===========================
// CONFIG
// ===========================

// Replace with your actual published Google Sheet CSV link
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-12345/pub?output=csv";

// Dummy items
const dummyItems = [
  { name: "Old NCERT Books", category: "Books", img: "https://i.imgur.com/3Qy6hXJ.png", donor: "Aarav" },
  { name: "Broken Smartphone", category: "Electronics", img: "https://i.imgur.com/zY3Rkvd.png", donor: "Neha" },
  { name: "College Backpack", category: "Accessories", img: "https://i.imgur.com/kEVP7S9.png", donor: "Rohan" },
  { name: "Desk Chair", category: "Furniture", img: "https://i.imgur.com/8cEM5Rh.png", donor: "Ishita" },
  { name: "Old Laptop", category: "Electronics", img: "https://i.imgur.com/R71mPtR.png", donor: "Aarav" },
  { name: "Cycling Helmet", category: "Sports", img: "https://i.imgur.com/7zXHLPt.png", donor: "Neha" }
];

let donatedItems = [];
let donorMap = {};

// ===========================
// LOAD ITEMS
// ===========================
async function loadDonatedItems() {
  try {
    const response = await fetch(sheetURL);
    const data = await response.text();
    const rows = data.split("\n").slice(1);

    donatedItems = [];

    rows.forEach(row => {
      const cols = row.split(",");
      if (cols.length >= 4) {
        const name = cols[0].trim();
        const category = cols[1].trim();
        const img = cols[2].trim() || "https://i.imgur.com/placeholder.png";
        const donor = cols[3].trim() || "Anonymous";

        if (name) donatedItems.push({ name, category, img, donor });
      }
    });

    if (donatedItems.length === 0) donatedItems = dummyItems;

    renderItems();
    updateImpact();
    updateLeaderboard();
  } catch (e) {
    console.warn("Using dummy items only.");
    donatedItems = dummyItems;
    renderItems();
    updateImpact();
    updateLeaderboard();
  }
}

// ===========================
// RENDER ITEMS
// ===========================
function renderItems() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  donatedItems.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>Category: ${item.category}</p>
      <p class="donor-tag">Donated by: <b>${item.donor}</b></p>
      <button onclick="addToCart('${item.name}')">Add to Cart</button>
    `;
    grid.appendChild(div);
  });
}

// ===========================
// SEARCH
// ===========================
function searchProducts() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const products = document.querySelectorAll(".product");
  products.forEach(product => {
    const title = product.querySelector("h3").innerText.toLowerCase();
    product.style.display = title.includes(input) ? "block" : "none";
  });
}

// ===========================
// CART
// ===========================
let cart = [];

function addToCart(itemName) {
  cart.push(itemName);
  alert(itemName + " added to cart!");
  renderCart();
}
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = cart.length === 0 ? "<p>Your cart is empty.</p>" : "";
  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<span>${item}</span><button onclick="removeFromCart(${index})">Remove</button>`;
    cartItems.appendChild(div);
  });
}
function removeFromCart(index) { cart.splice(index, 1); renderCart(); }
function openCart() { document.getElementById("cartPanel").style.display = "block"; renderCart(); }
document.getElementById("cartClose").addEventListener("click", () => { document.getElementById("cartPanel").style.display = "none"; });

// ===========================
// IMPACT TRACKER (ANIMATED)
// ===========================
function updateImpact() {
  let paper = 0, ewaste = 0, co2 = 0;
  donatedItems.forEach(item => {
    const cat = item.category.toLowerCase();
    if (cat.includes("book")) paper += 1;
    if (cat.includes("electronic")) ewaste += 5;
    co2 += 2;
  });

  animateCounter("paperSaved", paper);
  animateCounter("ewasteReduced", ewaste);
  animateCounter("co2Saved", co2);
}
function animateCounter(id, target) {
  let count = 0;
  const element = document.getElementById(id);
  const interval = setInterval(() => {
    if (count < target) {
      count++;
      element.innerText = count;
    } else {
      clearInterval(interval);
    }
  }, 40);
}

// ===========================
// LEADERBOARD
// ===========================
function updateLeaderboard() {
  donorMap = {};
  donatedItems.forEach(item => {
    if (!donorMap[item.donor]) donorMap[item.donor] = [];
    donorMap[item.donor].push(item);
  });

  const donorArray = Object.entries(donorMap).map(([name, items]) => ({ name, items: items.length }));
  donorArray.sort((a, b) => b.items - a.items);

  const list = document.getElementById("donorList");
  list.innerHTML = "";
  donorArray.forEach((d, i) => {
    let badge = i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1;
    const li = document.createElement("li");
    li.classList.add("donor-entry");
    li.innerHTML = `
      <span class="donor-rank">${badge}</span>
      <span class="donor-name clickable" onclick="showDonorItems('${d.name}')">${d.name}</span>
      <span class="donor-items">${d.items} items</span>`;
    list.appendChild(li);
  });
}
function showDonorItems(donorName) {
  const donorItems = donorMap[donorName] || [];
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
      <h2>${donorName}'s Donations</h2>
      <ul>${donorItems.map(i => `<li>📦 ${i.name} (${i.category})</li>`).join("")}</ul>
    </div>`;
  document.body.appendChild(modal);
}

// ===========================
// DARK MODE
// ===========================
const toggle = document.getElementById("darkToggle");
if (toggle) {
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", toggle.checked);
    localStorage.setItem("darkMode", toggle.checked);
  });
  if (localStorage.getItem("darkMode") === "true") {
    toggle.checked = true;
    document.body.classList.add("dark-mode");
  }
}

// ===========================
// INIT
// ===========================
window.onload = () => { loadDonatedItems(); };
