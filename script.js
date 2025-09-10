// --- Cart System ---
let cart = [];

// Add item to cart
function addToCart(item) {
  cart.push(item);
  updateCartCount();
  alert(item + " added to cart!");
}

// Update cart count in header
function updateCartCount() {
  document.getElementById("cart-count").innerText = cart.length;
}

// Show Cart Modal
function showCart() {
  let modal = document.getElementById("cart-modal");
  let cartItems = document.getElementById("cart-items");

  cartItems.innerHTML = ""; // Clear old items

  if (cart.length === 0) {
    cartItems.innerHTML = "<li>Your cart is empty.</li>";
  } else {
    cart.forEach((item, index) => {
      let li = document.createElement("li");
      li.textContent = item;

      // Remove button
      let removeBtn = document.createElement("button");
      removeBtn.textContent = "❌";
      removeBtn.style.marginLeft = "10px";
      removeBtn.onclick = () => {
        removeFromCart(index);
      };

      li.appendChild(removeBtn);
      cartItems.appendChild(li);
    });
  }

  modal.style.display = "block";
}

// Close Cart Modal
function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  showCart(); // Refresh modal
}

// --- Search System ---
function searchItems() {
  let input = document.getElementById("search-bar").value.toLowerCase();
  let items = document.querySelectorAll(".card");

  items.forEach(card => {
    let title = card.querySelector("h3").innerText.toLowerCase();
    let category = card.querySelector("p").innerText.toLowerCase();

    if (title.includes(input) || category.includes(input)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// --- Close modal if clicked outside ---
window.onclick = function(event) {
  let modal = document.getElementById("cart-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
