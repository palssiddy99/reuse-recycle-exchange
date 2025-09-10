// Demo dataset of items
const demoItems = [
  { id: 1, name: "Physics Book", category: "Books", condition: "Good", available: true },
  { id: 2, name: "Laptop (Dell)", category: "Electronics", condition: "Used", available: true },
  { id: 3, name: "Wooden Chair", category: "Furniture", condition: "Good", available: false },
  { id: 4, name: "Hoodie", category: "Clothes", condition: "New", available: true },
  { id: 5, name: "Pen Set", category: "Stationery", condition: "New", available: true },
];

// DOM Elements
const itemsContainer = document.querySelector(".items");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearch");
const filterCheckboxes = document.querySelectorAll(".f-cat");
const availableCheckbox = document.getElementById("f-available");

// Cart
const cartList = document.getElementById("cartList");
const cartEmpty = document.querySelector(".cart-empty");
const checkoutBtn = document.getElementById("checkoutBtn");
let cart = [];

// ===== RENDER ITEMS =====
function renderItems() {
  itemsContainer.innerHTML = "";
  const searchTerm = searchInput.value.toLowerCase();

  // Gather filters
  const selectedCategories = Array.from(filterCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);
  const onlyAvailable = availableCheckbox.checked;

  // Filter dataset
  let filtered = demoItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const matchesAvailability = !onlyAvailable || item.available;
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Render
  if (filtered.length === 0) {
    itemsContainer.innerHTML = "<p>No items found.</p>";
    return;
  }

  filtered.forEach(item => {
    const div = document.createElement("div");
    div.className = "item-card";
    div.innerHTML = `
      <h4>${item.name}</h4>
      <p>${item.category} | ${item.condition}</p>
      <button class="btn btn-soft" ${item.available ? "" : "disabled"}>${item.available ? "Add to Cart" : "Unavailable"}</button>
    `;

    const btn = div.querySelector("button");
    if (item.available) {
      btn.addEventListener("click", () => addToCart(item));
    }

    itemsContainer.appendChild(div);
  });
}

// ===== CART FUNCTIONS =====
function addToCart(item) {
  if (!cart.includes(item)) {
    cart.push(item);
    updateCart();
  }
}

function updateCart() {
  cartList.innerHTML = "";
  if (cart.length === 0) {
    cartEmpty.style.display = "block";
    return;
  }

  cartEmpty.style.display = "none";
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.name;
    cartList.appendChild(li);
  });
}

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert("Proceeding to checkout with: " + cart.map(i => i.name).join(", "));
  }
});

// ===== SEARCH / FILTER EVENTS =====
searchInput.addEventListener("input", renderItems);
clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  renderItems();
});
filterCheckboxes.forEach(cb => cb.addEventListener("change", renderItems));
availableCheckbox.addEventListener("change", renderItems);

// Init
renderItems();

// ===== IMPACT COUNTER ANIMATION =====
const counters = document.querySelectorAll(".stat-number");
counters.forEach(counter => {
  const update = () => {
    const target = +counter.getAttribute("data-target");
    const current = +counter.textContent;
    const increment = Math.ceil(target / 100);

    if (current < target) {
      counter.textContent = current + increment;
      setTimeout(update, 30);
    } else {
      counter.textContent = target;
    }
  };
  update();
});
