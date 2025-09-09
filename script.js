// ===== Firebase Init =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔹 Paste your Firebase config here
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_APP.firebaseapp.com",
  projectId: "YOUR_APP",
  storageBucket: "YOUR_APP.appspot.com",
  messagingSenderId: "123456",
  appId: "1:xxxx"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== State =====
let allItems = [];

// ===== Function: Load Items from Firestore =====
async function loadItems() {
  allItems = [];
  const querySnapshot = await getDocs(collection(db, "items"));
  querySnapshot.forEach(doc => {
    allItems.push(doc.data());
  });
  renderItems(allItems);
}

// ===== Function: Render Items =====
function renderItems(items) {
  const container = document.querySelector(".items");
  container.innerHTML = "";
  if (items.length === 0) {
    container.innerHTML = "<p>No items found.</p>";
    return;
  }
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <h4>${item.name}</h4>
      <p>${item.category}</p>
      <small>${item.condition || ""}</small>
    `;
    container.appendChild(card);
  });
}

// ===== Donate Form Submit =====
document.querySelector(".donate-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const [name, category, condition, desc] = e.target;
  try {
    await addDoc(collection(db, "items"), {
      name: name.value,
      category: category.value,
      condition: condition.value,
      description: desc.value,
      available: true
    });
    alert("Item donated successfully!");
    e.target.reset();
    loadItems();
  } catch (err) {
    console.error("Error adding document: ", err);
  }
});

// ===== Search Function =====
document.getElementById("searchInput").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = allItems.filter(item =>
    item.name.toLowerCase().includes(term) ||
    item.category.toLowerCase().includes(term)
  );
  renderItems(filtered);
});

document.getElementById("clearSearch").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  renderItems(allItems);
});

// ===== Init =====
loadItems();
