import { useState } from "react";
import "./App.css";

const products = [
  { id: 1, name: "T-shirt", category: "Clothing", price: 500, inStock: true },
  { id: 2, name: "Jeans", category: "Clothing", price: 1200, inStock: false },
  { id: 3, name: "Laptop", category: "Electronics", price: 50000, inStock: true },
  { id: 4, name: "Headphones", category: "Electronics", price: 2000, inStock: true },
  { id: 5, name: "Shoes", category: "Footwear", price: 3000, inStock: false },
];

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("none"); // none | asc | desc

  // Filter products
  let filteredProducts = products.filter((p) => {
    return (
      (selectedCategory === "All" || p.category === selectedCategory) &&
      p.price <= maxPrice &&
      (!inStockOnly || p.inStock)
    );
  });

  // Sort products
  if (sortOrder === "asc") {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc") {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="container">
      <h2>Ecommerce Filters & Sorting</h2>

      <div className="filters">
        <label>
          Category:
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="Footwear">Footwear</option>
          </select>
        </label>

        {/* <label>
          Max Price: ₹{maxPrice}
          <input
            type="range"
            min="0"
            max="50000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </label> */}

        <label>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          In Stock Only
        </label>

        <label>
          Sort by Price:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="none">None</option>
            <option value="asc">Low → High</option>
            <option value="desc">High → Low</option>
          </select>
        </label>
      </div>

      <div className="products">
        {filteredProducts.length === 0 && <p>No products match the filter.</p>}
        {filteredProducts.map((p) => (
          <div key={p.id} className="product-card">
            <h3>{p.name}</h3>
            <p>Category: {p.category}</p>
            <p>Price: ₹{p.price}</p>
            <p>Status: {p.inStock ? "In Stock" : "Out of Stock"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
