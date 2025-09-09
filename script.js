// ===== DEMO ITEMS (Indian context) =====
const demoItems = [
  { name: "NCERT Physics Class 12", category: "Books" },
  { name: "Indian Polity by Laxmikant", category: "Books" },
  { name: "Old Redmi Phone", category: "Electronics" },
  { name: "HP USB Mouse", category: "Electronics" },
  { name: "Plastic Chair", category: "Furniture" },
  { name: "Wooden Study Table", category: "Furniture" },
  { name: "Blue Kurta", category: "Clothes" },
  { name: "Cotton Saree", category: "Clothes" },
  { name: "Classmate Notebooks", category: "Stationery" },
  { name: "Geometry Box", category: "Stationery" }
];

// ===== FUNCTION: Render Items =====
function renderItems(items) {
  const container = document.querySelector(".items");
  container.innerHTML = "";
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `<h4>${item.name}</h4><p>${item.category}</p>`;
    container.appendChild(card);
  });
}

// ===== FUNCTION: Show Category =====
function showCategory(category) {
  let filtered = demoItems.filter(i => i.category === category);

  // Shuffle for randomness
  filtered = filtered.sort(() => 0.5 - Math.random());

  renderItems(filtered);
  document.getElementById("marketplace").scrollIntoView({ behavior: "smooth" });
}

// ===== Event Listeners on Category Buttons =====
document.querySelectorAll(".cat").forEach(btn => {
  btn.addEventListener("click", () => {
    const cat = btn.getAttribute("data-filter");
    showCategory(cat);
  });
});

// ===== Initial Load: Show all items =====
renderItems(demoItems);
