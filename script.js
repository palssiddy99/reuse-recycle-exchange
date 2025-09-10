// -------------------- DATA --------------------
const products = [
  { name: "Maths Textbook", category: "Books", price: 120, img: "https://images.unsplash.com/photo-1581091012184-7a48b0b6fa0e" },
  { name: "Laptop Dell Inspiron", category: "Electronics", price: 35000, img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3" },
  { name: "Kids T-shirt", category: "Clothes", price: 250, img: "https://images.unsplash.com/photo-1602810318851-8a5cb11a2d0e" },
  { name: "Wooden Chair", category: "Furniture", price: 1500, img: "https://images.unsplash.com/photo-1567016558829-4cce9b6f5932" },
  { name: "Toy Car", category: "Toys", price: 400, img: "https://images.unsplash.com/photo-1618354692346-7de6890c43e6" },
  { name: "English Novel", category: "Books", price: 200, img: "https://images.unsplash.com/photo-1512820790803-83ca734da794" },
  { name: "Headphones Sony", category: "Electronics", price: 2500, img: "https://images.unsplash.com/photo-1580894908361-1b3d1d0f2f43" },
  { name: "Jeans", category: "Clothes", price: 600, img: "https://images.unsplash.com/photo-1602810318851-8a5cb11a2d0e" },
  { name: "Study Table", category: "Furniture", price: 2000, img: "https://images.unsplash.com/photo-1598300053893-c7cb0418b197" },
  { name: "Action Figure", category: "Toys", price: 500, img: "https://images.unsplash.com/photo-1618354692346-7de6890c43e6" },
];

// Cart
let cart = [];

// -------------------- DOM --------------------
const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const itemsDonated = document.getElementById("itemsDonated");
const usersJoined = document.getElementById("usersJoined");

// -------------------- FUNCTIONS --------------------

// Display products
function displayProducts(list) {
  productGrid.innerHTML = "";
  list.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="addToCart(${index})">Add to Cart</button>
    `;
    productGrid.appendChild(card);
  });
}

// Add to Cart
function addToCart(index) {
  cart.push(products[index]);
  cartCount.textContent = cart.length;
  alert(`${products[index].name} added to cart!`);
}

// Category filter
function showCategory(cat) {
  const filtered = products.filter(p => p.category === cat);
  displayProducts(filtered);
}

// Search
function searchItems() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));
  displayProducts(filtered);
}

// -------------------- COUNTERS ANIMATION --------------------
let donated = 125; // example
let users = 75;    // example

function animateCounter(elem, target) {
  let count = 0;
  const step = Math.ceil(target / 100);
  const interval = setInterval(() => {
    count += step;
    if(count >= target) {
      count = target;
      clearInterval(interval);
    }
    elem.textContent = count;
  }, 20);
}

animateCounter(itemsDonated, donated);
animateCounter(usersJoined, users);

// -------------------- INIT --------------------
displayProducts(products);

// -------------------- CONTACT FORM --------------------
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Thank you! Your message has been sent.");
  this.reset();
});
