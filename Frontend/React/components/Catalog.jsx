import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/catalog.css';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Catalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI States
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isBuyMode, setIsBuyMode] = useState(false); 
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [maxPrice, setMaxPrice] = useState(100); 
  const [showInStockOnly, setShowInStockOnly] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API}/api/inventory`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();        
        const sortedData = data.sort((a, b) => a.id - b.id);
        
        setProducts(sortedData);
      } catch (err) {
        console.error("Database error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const itemsPerPage = 6;

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const currentPrice = isBuyMode ? product.price * 5 : product.price;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = currentPrice <= maxPrice;
    const matchesStock = showInStockOnly ? product.stock > 0 : true;
    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = filteredProducts.slice(firstIndex, lastIndex);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  return (
    <div className="catalog-layout">
      {/* Sidebar Filters */}
      <aside className="filter-sidebar">
        <h3>Filters</h3>
        
        <div className="filter-section">
          <p className="filter-title">AVAILABILITY</p>
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={showInStockOnly}
              onChange={() => {
                setShowInStockOnly(!showInStockOnly);
                setCurrentPage(1);
              }} 
            />
            In Stock Only
          </label>
        </div>

        <div className="filter-section">
          <p className="filter-title">CATEGORIES</p>
          {["New Releases", "Highest Rated", "Classics", "Family & Kids", "Action", "Comedy", "Mystery & Thriller", "Sci-Fi"].map(cat => (
            <label key={cat} className="checkbox-label">
              <input 
                type="checkbox" 
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)} 
              />
              {cat}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <p className="filter-title">PRICE RANGE</p>
          <input 
            type="range" 
            min="0" 
            max={isBuyMode ? "100" : "20"} 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)} 
          />
          <div className="price-labels">
            <span>$0</span>
            <span>${maxPrice}</span>
          </div>
        </div>
      </aside>

      <div className="catalog-container">
        {/* Search & Toggle */}
        <div className="search-controls">
          <input 
            type="text" 
            placeholder="Search DVDs..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); 
            }}
          />
          <div className="toggle-group">
            <span className={!isBuyMode ? "active-label" : ""}>Rent</span>
            <label className="switch">
              <input type="checkbox" checked={isBuyMode} onChange={() => setIsBuyMode(!isBuyMode)} />
              <span className="slider round"></span>
            </label>
            <span className={isBuyMode ? "active-label" : ""}>Buy</span>
          </div>
        </div>

        {/* Loading State for Grid Only */}
        {isLoading ? (
          <div className="loading-grid">Loading Movie Collection...</div>
        ) : (
          <div className="product-grid">
            {currentItems.length > 0 ? (
              currentItems.map(product => {
                const displayPrice = isBuyMode ? (product.price * 5).toFixed(2) : product.price.toFixed(2);
                const isOutOfStock = product.stock === 0;

                return (
                  <div key={product.id} className="product-card" onClick={() => navigate(`/catalog/${product.id}`)}>
                    <div className="image-box">
                      <img src={product.image} alt={product.name} style={{ opacity: isOutOfStock ? 0.5 : 1 }} />
                    </div>
                    <h3>{product.name}</h3>
                    <p className="price">${displayPrice} {!isBuyMode && <small>/day</small>}</p>
                    <button className="add-btn" disabled={isOutOfStock} style={{ backgroundColor: isOutOfStock ? "#444" : "#2563eb" }}>
                      {isOutOfStock ? "Out of Stock" : (isBuyMode ? "Buy Now" : "Rent Now")}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="no-results">No DVDs found for "{searchTerm}"</div>
            )}
          </div>
        )}
        
        {/* Pagination */}
        <div className="pagination">
          <button className="nav-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
          <span className="page-info"> Page {currentPage} of {totalPages || 1} </span>
          <button className="nav-btn" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}
