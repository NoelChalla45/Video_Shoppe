import { useState } from 'react';
import { products } from '../components/ProductList'; 
import '../Styles/catalog.css';

export default function Catalog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Set state for search term input
  const [isBuyMode, setIsBuyMode] = useState(false); // Sets the default toggle for rent/buy switch (default/false is Rent)  
  const [selectedCategories, setSelectedCategories] = useState([]); // State that tracks the selected categories for Filter
  const [maxPrice, setMaxPrice] = useState(100); // Sets the default max price for the price range filter (default for buying is $100)
  const [showInStockOnly, setShowInStockOnly] = useState(false); // State for availability filter

  const itemsPerPage = 6;

  // Include Categories, Price Range, and Stock for Filter
  const filteredProducts = products.filter(product => {
    const currentPrice = isBuyMode ? product.price * 5 : product.price;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = currentPrice <= maxPrice;
    const matchesStock = showInStockOnly ? product.stock > 0 : true; // Stock filter logic

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = filteredProducts.slice(firstIndex, lastIndex);

  // Toggles categories
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    setCurrentPage(1); // Goes back to page 1 when filtering
  };

  return (
    <div className="catalog-layout">
      
      {/* Sidebar Filter for Catalog */}
      <aside className="filter-sidebar">
        <h3>Filters</h3>
        
        <div className="filter-section">
          <p className="filter-title">Availability</p>
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
          <p className="filter-title">Categories</p>
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
          <p className="filter-title">Price Range</p>
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
        
        {/* Search bar for the Catalog Page*/}
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
          
          {/* Toggle switch for Rent/Buy*/}
          <div className="toggle-group">
            <span className={!isBuyMode ? "active-label" : ""}>Rent</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={isBuyMode} 
                onChange={() => setIsBuyMode(!isBuyMode)} 
              />
              <span className="slider round"></span>
            </label>
            <span className={isBuyMode ? "active-label" : ""}>Buy</span>
          </div>
        </div>

        {/* Product grid that changes prices based on Buy/Rent toggle*/}
        <div className="product-grid">
          {currentItems.length > 0 ? (
            currentItems.map(product => {
              const displayPrice = isBuyMode 
                ? (product.price * 5).toFixed(2) 
                : product.price.toFixed(2);
              
              const isOutOfStock = product.stock === 0;

              return (
                <div key={product.id} className="product-card">
                  <div className="image-box">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ opacity: isOutOfStock ? 0.5 : 1 }} // Dims image if out of stock
                      />
                  </div>
                  <h3>{product.name}</h3>
                  <p className="price">
                    ${displayPrice} {!isBuyMode && <small>/day</small>}
                  </p>
                  
                  {/* The Button that shifts from Rent to Buy and handles stock status */}
                  <button 
                    className="add-btn" 
                    disabled={isOutOfStock}
                    style={{ 
                      backgroundColor: isOutOfStock ? "#444" : "#2563eb",
                      cursor: isOutOfStock ? "not-allowed" : "pointer" 
                    }}
                  >
                    {isOutOfStock ? "Out of Stock" : (isBuyMode ? "Buy Now" : "Rent Now")}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="no-results">No DVDs found for "{searchTerm}"</div>
          )}
        </div>
        
        {/* Page controls (auto-scrolls to the top of the page upon change)*/}
        <div className="pagination">
          <button 
            className="nav-btn"
            disabled={currentPage === 1} 
            onClick={() => {
              setCurrentPage(prev => prev - 1);
              //window.scrollTo(0, 0); 
            }}
          >
            Prev
          </button>
          
          <span className="page-info"> Page {currentPage} of {totalPages || 1} </span>

          <button 
            className="nav-btn"
            disabled={currentPage === totalPages || totalPages === 0} 
            onClick={() => {
              setCurrentPage(prev => prev + 1);
              //window.scrollTo(0, 0);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

}
