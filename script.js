// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Sample items
const sampleItems = [
  {
    title: "📚 Old Textbooks",
    description: "Engineering books from last semester",
    category: "Books",
    condition: "Good",
    contact: "student@example.com",
    imageUrl: "https://source.unsplash.com/400x300/?books"
  },
  {
    title: "🪑 Study Table",
    description: "Wooden study table in decent condition",
    category: "Furniture",
    condition: "Fair",
    contact: "9999999999",
    imageUrl: "https://source.unsplash.com/400x300/?table"
  },
  {
    title: "💻 Used Laptop",
    description: "Old but working Dell laptop",
    category: "Electronics",
    condition: "Like New",
    contact: "student2@example.com",
    imageUrl: "https://source.unsplash.com/400x300/?laptop"
  }
];

let items = [];

// Add item card
function renderItems(list = items) {
  const grid = document.getElementById("itemsGrid");
  grid.innerHTML = "";

  list.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${item.imageUrl || "https://via.placeholder.com/400x300"}" alt="Item image">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <p><b>Category:</b> ${item.category}</p>
      <p><b>Condition:</b> ${item.condition}</p>
      <p><b>Contact:</b> ${item.contact}</p>
    `;
    grid.appendChild(card);
  });
}

// Load samples
document.getElementById("loadSample").onclick = () => {
  items = [...sampleItems];
  renderItems();
};

// Modal controls
const modal = document.getElementById("modal");
document.getElementById("openAddBtn").onclick = () => modal.classList.remove("hidden");
document.getElementById("closeModal").onclick = () => modal.classList.add("hidden");
document.getElementById("cancelAdd").onclick = () => modal.classList.add("hidden");

// Handle form
document.getElementById("itemForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  const newItem = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    condition: formData.get("condition"),
    contact: formData.get("contact"),
    imageUrl: formData.get("imageUrl")
  };

  items.unshift(newItem);
  renderItems();
  modal.classList.add("hidden");
  this.reset();
});

// Search + filter + sort
document.getElementById("searchInput").addEventListener("input", filterAndSort);
document.getElementById("categoryFilter").addEventListener("change", filterAndSort);
document.getElementById("sortSelect").addEventListener("change", filterAndSort);

function filterAndSort() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const sort = document.getElementById("sortSelect").value;

  let filtered = items.filter(i =>
    i.title.toLowerCase().includes(search) ||
    i.description.toLowerCase().includes(search)
  );
  if (category) filtered = filtered.filter(i => i.category === category);

  if (sort === "newest") filtered = filtered.reverse();
  if (sort === "condition") {
    const order = ["New", "Like New", "Good", "Fair"];
    filtered.sort((a, b) => order.indexOf(a.condition) - order.indexOf(b.condition));
  }

  renderItems(filtered);
}
