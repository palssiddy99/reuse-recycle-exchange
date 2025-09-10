// DARK MODE TOGGLE
document.getElementById("darkToggle").addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

// CART
let cart = [];
const cartPanel = document.getElementById("cartPanel");
const cartItemsEl = document.getElementById("cartItems");
document.getElementById("cartClose").onclick = () => cartPanel.classList.remove("open");
document.getElementById("cartButton").addEventListener("click", () => cartPanel.classList.add("open"));
function addToCart(itemName) {
  cart.push(itemName);
  renderCart();
}
function renderCart() {
  cartItemsEl.innerHTML = cart.map(c => `<p>${c}</p>`).join("");
}

// DUMMY PRODUCTS
let products = [
  { name: "NCERT Physics Book", category: "Books" },
  { name: "Used Wooden Study Table", category: "Furniture" },
  { name: "Dell Laptop (2018)", category: "Electronics" },
  { name: "Men’s Kurta Set", category: "Clothes" },
  { name: "English Novel - Chetan Bhagat", category: "Books" },
  { name: "Plastic Chair", category: "Furniture" },
];

// RENDER PRODUCTS
const productGrid = document.getElementById("productGrid");
function renderProducts(list) {
  productGrid.innerHTML = "";
  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.category}</p>
      <button onclick="addToCart('${p.name}')">Add to Cart</button>
    `;
    productGrid.appendChild(div);
  });
}
renderProducts(products); // initially render dummy products

// SEARCH PRODUCTS
document.getElementById("searchInput").addEventListener("input", () => {
  const query = document.getElementById("searchInput").value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(query)));
});

// CATEGORY FILTER
function showCategory(cat) {
  renderProducts(products.filter(p => p.category === cat));
}

// DYNAMIC LOAD FROM GOOGLE FORM SHEET
const sheetURL = "https://script.google.com/macros/s/AKfycbxsKHPd_zkhOeoWsAVJ9H85WrFajMyyhmJnbnmLs3y12owT87x76BE3nOuPsg6jcFOhcg/exec"; // replace with deployed Apps Script URL
async function loadDonatedItems() {
  try {
    const res = await fetch(sheetURL);
    const data = await res.json();
    const donatedItems = data.map(item => ({
      name: item["Product Name"],   // match your sheet column exactly
      category: item["Category"] // match your sheet column
    }));
    products = donatedItems; // replace dummy products with form submissions
    renderProducts(products);
  } catch (err) {
    console.error("Failed to load donated items:", err);
  }
}
loadDonatedItems();

// IMPACT COUNTERS
function animateCounter(id) {
  const el = document.getElementById(id);
  const target = parseInt(el.dataset.target);
  let count = 0;
  const step = Math.ceil(target / 100);
  const interval = setInterval(() => {
    count += step;
    if (count >= target) {
      el.innerText = target.toLocaleString();
      clearInterval(interval);
    } else {
      el.innerText = count.toLocaleString();
    }
  }, 20);
}
["itemsDonated","usersJoined","paperSaved","ewasteReduced","co2Saved"].forEach(animateCounter);

// LEADERBOARD
const donors = [
  { name: "Rahul Sharma", items: 14 },
  { name: "Priya Patel", items: 12 },
  { name: "Amit Verma", items: 10 },
  { name: "Sneha Reddy", items: 8 },
  { name: "Ankit Singh", items: 6 },
];
const donorList = document.getElementById("donorList");
donors.forEach(d => {
  const li = document.createElement("li");
  li.innerHTML = `<span>${d.name}</span> <span class="badge">📦 ${d.items}</span>`;
  donorList.appendChild(li);
});
