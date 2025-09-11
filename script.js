// ============ CART SYSTEM ============
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");

// Show/Hide cart
cartButton.addEventListener("click", () => cartPanel.classList.add("active"));
cartClose.addEventListener("click", () => cartPanel.classList.remove("active"));

// Add to cart
document.querySelectorAll(".product-card button").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const productCard = btn.closest(".product-card");
    const product = {
      name: productCard.querySelector("h3").innerText,
      price: productCard.querySelector(".price").innerText,
      img: productCard.querySelector("img").src
    };
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  });
});

// Render cart
function renderCart() {
  cartItems.innerHTML = "";
  cart.forEach((item, i) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.img}" width="50">
      <span>${item.name} - ${item.price}</span>
      <button onclick="removeFromCart(${i})">❌</button>
    `;
    cartItems.appendChild(div);
  });
}
function removeFromCart(i) {
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}
renderCart();


// ============ WISHLIST ============
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

document.querySelectorAll(".wishlist-btn").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const productCard = btn.closest(".product-card");
    const product = {
      name: productCard.querySelector("h3").innerText,
      price: productCard.querySelector(".price").innerText,
      img: productCard.querySelector("img").src
    };

    // Toggle wishlist
    const exists = wishlist.find(p => p.name === product.name);
    if (exists) {
      wishlist = wishlist.filter(p => p.name !== product.name);
      btn.classList.remove("active");
    } else {
      wishlist.push(product);
      btn.classList.add("active");
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  });

  // Keep heart red if already in wishlist
  const productName = btn.closest(".product-card").querySelector("h3").innerText;
  if (wishlist.find(p => p.name === productName)) {
    btn.classList.add("active");
  }
});


// ============ LOGIN DEMO ============
let user = localStorage.getItem("user");

function loginUser(name = "Guest") {
  user = name;
  localStorage.setItem("user", user);
  document.querySelector(".logo").innerText = `♻ Welcome, ${user}`;
}
function logoutUser() {
  user = null;
  localStorage.removeItem("user");
  document.querySelector(".logo").innerText = "♻ Reuse & Recycle Exchange";
}

// Demo login
if (!user) {
  const name = prompt("Enter your name to login:");
  if (name) loginUser(name);
} else {
  loginUser(user);
}


// ============ COUNTERS ============
const counters = document.querySelectorAll("[data-target]");
counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.getAttribute("data-target");
    const count = +counter.innerText.replace(/,/g, "");
    const speed = 50;

    if (count < target) {
      counter.innerText = (count + Math.ceil(target / speed)).toLocaleString();
      setTimeout(updateCount, 30);
    } else {
      counter.innerText = target.toLocaleString();
    }
  };
  updateCount();
});


// ============ SEARCH ============
function searchProducts() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  document.querySelectorAll(".product-card").forEach(card => {
    const name = card.querySelector("h3").innerText.toLowerCase();
    card.style.display = name.includes(query) ? "block" : "none";
  });
}


// ============ CATEGORY FILTER ============
function showCategory(category) {
  document.querySelectorAll(".product-card").forEach(card => {
    const name = card.querySelector("h3").innerText.toLowerCase();
    card.style.display = name.includes(category.toLowerCase()) ? "block" : "none";
  });
}
