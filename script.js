// ===== Utils =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Year in footer
$("#yr").textContent = new Date().getFullYear();

// Mobile nav (simple)
$(".nav-toggle")?.addEventListener("click", () => {
  const nav = $(".nav");
  if (!nav) return;
  nav.style.display = nav.style.display === "flex" ? "none" : "flex";
});

// ===== Impact counters (animate on view) =====
const counters = $$(".stat-number");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.target, 10);
    const dur = 1200; // ms
    const start = performance.now();

    const tick = (t0) => {
      const p = Math.min(1, (t0 - start) / dur);
      el.textContent = Math.floor(target * (0.1 + 0.9 * p)).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    observer.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach((c) => observer.observe(c));

// ===== Stories carousel =====
(() => {
  const track = $(".carousel");
  const prev = $(".stories .prev");
  const next = $(".stories .next");
  if (!track) return;
  const slides = $$(".story", track);
  let index = 0;
  const go = (i) => {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  };
  prev.addEventListener("click", () => go(index - 1));
  next.addEventListener("click", () => go(index + 1));
  // Auto-advance
  setInterval(() => go(index + 1), 6000);
})();

// ===== Marketplace data =====
const catalog = [
  { id: 1, name: "Wooden Desk", category: "Furniture", price: 0, condition: "Good", img: "https://images.unsplash.com/photo-1582582621959-48d3d4a8d7b3?q=80&w=800&auto=format&fit=crop", available: true },
  { id: 2, name: "Desk Lamp", category: "Electronics", price: 0, condition: "Used", img: "https://images.unsplash.com/photo-1517957754642-d8237c4e0a69?q=80&w=800&auto=format&fit=crop", available: true },
  { id: 3, name: "C Programming Book", category: "Books", price: 0, condition: "Like New", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop", available: true },
  { id: 4, name: "Office Chair", category: "Furniture", price: 0, condition: "Used", img: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=80&w=800&auto=format&fit=crop", available: false },
  { id: 5, name: "Casual T-Shirt", category: "Clothes", price: 0, condition: "Good", img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800&auto=format&fit=crop", available: true },
  { id: 6, name: "Geometry Set", category: "Stationery", price: 0, condition: "New", img: "https://images.unsplash.com/photo-1491841651911-c44c30c34548?q=80&
