// Dark mode
document.getElementById("darkToggle").addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});

// Dummy donated products
const products = [
  { name: "NCERT Physics Book", category: "Books" },
  { name: "Used Wooden Study Table", category: "Furniture" },
  { name: "Dell Laptop (2018)", category: "Electronics" },
  { name: "Men’s Kurta Set", category: "Clothes" },
  { name: "English Novel - Chetan Bhagat", category: "Books" },
  { name: "Plastic Chair", category: "Furniture" },
];

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

// Counters
let itemsDonated = 0, usersJoined = 0, paper = 0, ewaste = 0, co2 = 0;
setInterval(() => {
  if (itemsDonated < 120) document.getElementById("itemsDonated").innerText = ++itemsDonated;
  if (usersJoined < 45) document.getElementById("usersJoined").innerText = ++usersJoined;
  if (paper < 200) document.getElementById("paperSaved").innerText = ++paper;
  if (ewaste < 100) document.getElementById("ewasteReduced").innerText = ++ewaste;
  if (co2 < 300) document.getElementById("co2Saved").innerText = ++co2;
}, 50);

// Donors (Indian names + donated items)
const donors = [
  { name: "Aarav Sharma", items: ["NCERT Physics Book", "Plastic Chair"] },
  { name: "Priya Patel", items: ["Dell Laptop (2018)", "English Novel - Chetan Bhagat"] },
  { name: "Rohan Verma", items: ["Men’s Kurta Set"] },
  { name: "Sneha Iyer", items: ["Used Wooden Study Table", "NCERT Physics Book"] },
  { name: "Aditya Mehra", items: ["Plastic Chair", "English Novel - Chetan Bhagat"] },
];

const donorList = document.getElementById("donorList");
donors.forEach((d, i) => {
  const li = document.createElement("li");
  li.innerHTML = `<span onclick="showDonorItems(${i})">${d.name}</span>`;
  donorList.appendChild(li);
});

function showDonorItems(index) {
  const donor = donors[index];
  alert(`${donor.name} donated:\n- ${donor.items.join("\n- ")}`);
}
