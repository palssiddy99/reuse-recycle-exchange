body {
  font-family: 'Inter', Arial, sans-serif;
  margin: 0;
  background: #f4f7f6;
  color: #333;
}
header {
  background: #2e7d32;
  color: white;
  padding: 1rem;
  text-align: center;
}
nav {
  background: #388e3c;
  padding: 0.5rem;
  text-align: center;
}
nav a {
  color: white;
  margin: 0 1rem;
  text-decoration: none;
  font-weight: bold;
}
nav a:hover {
  text-decoration: underline;
}
.container {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
}
.card {
  background: white;
  padding: 1.5rem;
  margin: 1rem 0;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.btn {
  display: inline-block;
  background: #2e7d32;
  color: white;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
}
.btn:hover {
  background: #1b5e20;
}
footer {
  background: #2e7d32;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: 2rem;
}
.modal.hidden {
  display: none;
}
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-panel {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}
.modal-close {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  float: right;
}
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.items-grid .card {
  padding: 1rem;
  text-align: center;
}
