// Demo items
const items = [
  { name: "Mathematics Book", category: "books", image: "https://via.placeholder.com/150" },
  { name: "Science Book", category: "books", image: "https://via.placeholder.com/150" },
  { name: "Laptop", category: "electronics", image: "https://via.placeholder.com/150" },
  { name: "Headphones", category: "electronics", image: "https://via.placeholder.com/150" },
  { name: "T-Shirt", category: "clothes", image: "https://via.placeholder.com/150" },
  { name: "Jeans", category: "clothes", image: "https://via.placeholder.com/150" },
  { name: "Toy Car", category: "toys", image: "https://via.placeholder.com/150" },
  { name: "Doll", category: "toys", image: "https://via.placeholder.com/150" }
];

let cart = [];

// DOM Elements
const itemsContainer = document.getElementById("itemsContainer");
const cartCount = document.getElementById("cartCount");
const cartSection = document.getElementById("cartSection");
const cartItems = document.getElementById("cartItems");

// Render items
function renderItems(list) {
  itemsContainer.innerHTML = "";
  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <button onclick="addToCart('${item.name}')">Add to Cart</button>
    `;
    itemsContainer.appendChild(card);
  });
}

// Add to cart
function addToCart(itemName) {
  const item = items.find(i => i.name === itemName);
  cart.push(item);
  cartCount.textContent = cart.length;
}

// Render cart
function renderCart() {
  cartItems.innerHTML = "";
  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }
  cart.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItems.appendChild(card);
  });
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  cartCount.textContent = cart.length;
  renderCart();
}

// Category filter
document.querySelectorAll(".category").forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;
    const filtered = items.filter(item => item.category === category);
    renderItems(filtered);
  });
});

// Search filter
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = items.filter(item => item.name.toLowerCase().includes(query));
  renderItems(filtered);
});

// Cart buttons
document.getElementById("cartBtn").addEventListener("click", () => {
  renderCart();
  cartSection.classList.remove("hidden");
});

document.getElementById("closeCartBtn").addEventListener("click", () => {
  cartSection.classList.add("hidden");
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  alert("Checkout successful! Thank you for reusing & recycling 🌍");
  cart = [];
  cartCount.textContent = 0;
  renderCart();
});

// Initial render
renderItems(items);
