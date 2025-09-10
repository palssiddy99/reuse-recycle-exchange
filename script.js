// ===========================
// CONFIG
// ===========================

// Replace this with your actual published Google Sheet CSV link
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-12345/pub?output=csv";

// ===========================
// LOAD DONATED ITEMS
// ===========================
async function loadDonatedItems() {
  try {
    const response = await fetch(sheetURL);
    const data = await response.text();
    const rows = data.split("\n").slice(1); // Skip header row

    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    rows.forEach(row => {
      const cols = row.split(",");
      if (cols.length >= 3) {
        const name = cols[0].trim();
        const category = cols[1].trim();
        const img = cols[2].trim() || "https://i.imgur.com/placeholder.png";

        if (name) {
          const div = document.createElement("div");
          div.classList.add("product");
          div.innerHTML = `
            <img src="${img}" alt="${name}">
            <h3>${name}</h3>
            <p>Category: ${category}</p>
            <button onclick="addToCart('${name}')">Add to Cart</button>
          `;
          grid.appendChild(div);
        }
      }
    });

    // Update impact tracker + leaderboard after items load
    updateImpact();
    updateLeaderboard();

  } catch (error) {
    console.error("Error loading donated items:", error);
  }
}

// ===========================
// SEARCH FUNCTION
// ===========================
function searchProducts() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const products = document.querySelectorAll(".product");

  products.forEach(product => {
    const title = product.querySelector("h3").innerText.toLowerCase();
    if (title.includes(input)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

// ===========================
// FILTER BY CATEGORY
// ===========================
function showCategory(category) {
  const products = document.querySelectorAll(".product");
  products.forEach(product => {
    const text = product.querySelector("p").innerText;
    if (text.includes(category)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

// ===========================
// CART SYSTEM
// ===========================
let cart = [];

function addToCart(itemName) {
  cart.push(itemName);
  alert(itemName + " added to cart!");
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item}</span>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItems.appendChild(div);
  });
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// ===========================
// CART PANEL TOGGLE
// ===========================
const cartPanel = document.getElementById("cartPanel");
const cartClose = document.getElementById("cartClose");

if (cartClose) {
  cartClose.addEventListener("click", () => {
    cartPanel.style.display = "none";
  });
}

function openCart() {
  cartPanel.style.display = "block";
  renderCart();
}

// ===========================
// COUNTERS (ABOUT SECTION)
// ===========================
function animateCounters() {
  let donatedCount = 0;
  let usersCount = 0;
  const donatedTarget = 120; // Example number
  const usersTarget = 75;

  const donatedInterval = setInterval(() => {
    if (donatedCount < donatedTarget) {
      donatedCount++;
      document.getElementById("itemsDonated").innerText = donatedCount;
    } else {
      clearInterval(donatedInterval);
    }
  }, 30);

  const usersInterval = setInterval(() => {
    if (usersCount < usersTarget) {
      usersCount++;
      document.getElementById("usersJoined").innerText = usersCount;
    } else {
      clearInterval(usersInterval);
    }
  }, 40);
}

// ===========================
// IMPACT TRACKER
// ===========================
function updateImpact() {
  const products = document.querySelectorAll(".product");
  let paper = 0, ewaste = 0, co2 = 0;

  products.forEach(p => {
    const category = p.querySelector("p").innerText.toLowerCase();
    if (category.includes("book")) paper += 1;
    if (category.includes("electronic")) ewaste += 5;
    co2 += 2; // every item saves ~2kg CO₂
  });

  document.getElementById("paperSaved").innerText = paper;
  document.getElementById("ewasteReduced").innerText = ewaste;
  document.getElementById("co2Saved").innerText = co2;
}

// ===========================
// LEADERBOARD (from Google Sheet)
// ===========================
async function updateLeaderboard() {
  try {
    const response = await fetch(sheetURL);
    const data = await response.text();
    const rows = data.split("\n").slice(1); // skip header

    const donors = {};

    rows.forEach(row => {
      const cols = row.split(",");
      if (cols.length >= 4) {
        const donorName = cols[3]?.trim() || "Anonymous"; // assuming column 4 is donor name
        donors[donorName] = (donors[donorName] || 0) + 1;
      }
    });

    // Convert to array and sort
    const donorArray = Object.entries(donors).map(([name, items]) => ({ name, items }));
    donorArray.sort((a, b) => b.items - a.items);

    const list = document.getElementById("donorList");
    list.innerHTML = "";

    donorArray.forEach((d, index) => {
      const li = document.createElement("li");
      li.classList.add("donor-entry");

      // Add crown/medals for top 3
      let badge = "";
      if (index === 0) badge = "👑";
      else if (index === 1) badge = "🥈";
      else if (index === 2) badge = "🥉";

      li.innerHTML = `<span class="donor-rank">${badge || index + 1}</span>
                      <span class="donor-name">${d.name}</span>
                      <span class="donor-items">${d.items} items</span>`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading leaderboard:", err);
  }
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
window.onload = function () {
  loadDonatedItems();
  animateCounters();
};
