// Dark mode toggle
document.getElementById("darkToggle").addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});

// Dummy products
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

// Dummy donors
const donors = [
  { name: "Aarav Sharma", items: ["NCERT Physics Book", "Plastic Chair"] },
  { name: "Priya Patel", items: ["Dell Laptop (2018)", "English Novel - Chetan Bhagat"] },
  { name: "Rohan Verma", items: ["Men’s Kurta Set"] },
  { name: "Sneha Iyer", items: ["Used Wooden Study Table", "NCERT Physics Book"] },
  { name: "Aditya Mehra", items: ["Plastic Chair", "English Novel - Chetan Bhagat"] },
  { name: "Ishita Nair", items: ["Math Reference Book", "Wooden Stool"] },
  { name: "Kunal Joshi", items: ["Old Smartphone", "Headphones"] },
  { name: "Meera Reddy", items: ["Saree", "Cooking Utensils"] },
  { name: "Vikram Singh", items: ["Office Chair", "Keyboard"] },
  { name: "Ananya Gupta", items: ["School Bag", "Story Books"] },
];

// Leaderboard
const donorList = document.getElementById("donorList");
donors.forEach((d, i) => {
  const li = document.createElement("li");
  li.innerHTML = `<span onclick="showDonorItems(${i})">${d.name}</span>`;
  donorList.appendChild(li);
});

// Show donor items
function showDonorItems(index) {
  const donor = donors[index];
  alert(`${donor.name} donated:\n- ${donor.items.join("\n- ")}`);
}
