// ===== PRODUCTS =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");

// ===== CART PANEL =====
cartButton.onclick = () => { cartPanel.classList.add("active"); updateCart(); };
cartClose.onclick = () => { cartPanel.classList.remove("active"); };

// ===== UPDATE CART =====
function updateCart(){
  cartItems.innerHTML = "";
  cart.forEach((item,i)=>{
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `<p>${item.name} - ₹${item.price}</p> <button onclick="removeCart(${i})">Remove</button>`;
    cartItems.appendChild(div);
  });
  cartCount.innerText = cart.length;
  localStorage.setItem("cart", JSON.stringify(cart));
}
function removeCart(index){ cart.splice(index,1); updateCart(); }

// ===== ADD TO CART =====
document.querySelectorAll(".product-card button").forEach((btn,i)=>{
  btn.onclick = ()=>{
    const card = btn.parentElement;
    const name = card.querySelector("h3").innerText;
    const price = parseInt(card.querySelector(".price").innerText.replace("₹",""));
    cart.push({name,price});
    updateCart();
  };
});

// ===== WISHLIST =====
document.querySelectorAll(".wishlist-btn").forEach((btn,i)=>{
  btn.onclick = ()=>{
    const card = btn.parentElement;
    const name = card.querySelector("h3").innerText;
    const exists = wishlist.find(p=>p.name===name);
    if(exists){ wishlist = wishlist.filter(p=>p.name!==name); btn.classList.remove("active"); }
    else { wishlist.push({name}); btn.classList.add("active"); }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };
});

// ===== DARK MODE =====
const toggle = document.getElementById("darkToggle");
toggle.onchange = () => { document.body.classList.toggle("dark", toggle.checked); };

// ===== LOGIN MODAL =====
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const submitLogin = document.getElementById("submitLogin");
loginBtn.onclick = () => loginModal.style.display = "flex";
closeLogin.onclick = () => loginModal.style.display = "none";
submitLogin.onclick = () => {
  const username = document.getElementById("usernameInput").value;
  if(username){
    localStorage.setItem("username", username);
    loginBtn.innerText = `Hi, ${username}`;
    loginModal.style.display = "none";
  }
};

// ===== COUNTER ANIMATION =====
function animateCounter(id){
  const el = document.getElementById(id);
  const target = +el.dataset.target;
  let count = 0;
  const step = target / 100;
  const interval = setInterval(()=>{
    count += step;
    if(count>=target){ count=target; clearInterval(interval);}
    el.textContent = Math.floor(count);
  },30);
}
["itemsDonated","usersJoined","paperSaved","ewasteReduced","co2Saved"].forEach(animateCounter);

// ===== LEADERBOARD =====
const donors = ["Aarav","Priya","Kabir","Meera","Rohan","Ishita","Aditya"];
const donorList = document.getElementById("donorList");
donors.forEach((d,i)=>{
  const li = document.createElement("li");
  li.innerText = `${i+1}. ${d} - ${Math.floor(Math.random()*20+1)} items`;
  donorList.appendChild(li);
});

// ===== CONTACT FORM =====
document.getElementById("contactForm").addEventListener("submit", e=>{
  e.preventDefault();
  document.getElementById("formMsg").innerText = "✅ Message sent successfully!";
  e.target.reset();
});

// ===== CATEGORY FILTER =====
function showCategory(cat){
  document.getElementById("products").scrollIntoView({behavior:"smooth"});
  document.querySelectorAll(".product-card").forEach(card=>{
    card.style.display = card.querySelector("h3").innerText.toLowerCase().includes(cat.toLowerCase()) ? "block" : "none";
  });
}

// ===== SEARCH =====
function searchProducts(){
  const query = document.getElementById("searchInput").value.toLowerCase();
  document.querySelectorAll(".product-card").forEach(card=>{
    card.style.display = card.querySelector("h3").innerText.toLowerCase().includes(query) ? "block" : "none";
  });
}

// ===== FADE IN ANIMATION ON SCROLL =====
const faders = document.querySelectorAll(".fadeIn");
window.addEventListener("scroll", () => {
  faders.forEach(fader=>{
    const top = fader.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;
    if(top < screenHeight - 50){ fader.style.opacity=1; fader.style.transform="translateY(0)"; }
  });
});
