// Dark mode toggle
document.getElementById("darkToggle").addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});

// Dummy products (will be replaced dynamically)
const products = [
  { name: "NCERT Physics Book", category: "Books" },
  { name: "Used Wooden Study Table", category: "Furniture" },
  { name: "Dell Laptop (2018)", category: "Electronics" },
  { name: "Men’s Kurta Set", category: "Clothes" },
  { name: "English Novel - Chetan Bhagat", category: "Books" },
  { name: "Plastic Chair", category: "Furniture" },
];

// Render products
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
renderProducts(products);

// Dynamic Load from Google Form Sheet
const sheetURL = "https://script.google.com/macros/s/AKfycbxsKHPd_zkhOeoWsAVJ9H85WrFajMyyhmJnbnmLs3y12owT87x76BE3nOuPsg6jcFOhcg/exec"; // Replace with your Apps Script URL
async function loadDonatedItems() {
  try {
    const res = await fetch(sheetURL);
    const data = await res.json();
    const donatedItems = data.map(item => ({
      name: item["Product Name"],       // Match your sheet column
      category: item["Category"]     // Match your sheet column
    }));
    renderProducts(donatedItems);
  } catch (err) {
    console.error("Failed to load donated items:", err);
  }
}
loadDonatedItems();

// Search
function searchProducts() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(q)));
}

// Category filter
function showCategory(cat) {
  renderProducts(products.filter(p => p.category === cat));
}

// Cart
let cart = [];
function addToCart(item) {
  cart.push(item);
  updateCart();
  openCart();
}
function updateCart() {
  document.getElementById("cartItems").innerHTML = cart.map(c => `<p>${c}</p>`).join("");
}
document.getElementById("cartClose").onclick = () => {
  document.getElementById("cartPanel").classList.remove("active");
};
function openCart() {
  document.getElementById("cartPanel").classList.add("active");
}
document.getElementById("cartButton").addEventListener("click", openCart);

// Impact & Counters (dummy numbers already in HTML)
function animateCounter(id) {
  const el = document.getElementById(id);
  let target = parseInt(el.dataset.target);
  let count = 0;
  let step = Math.ceil(target / 100);
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

// Leaderboard dummy members
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
