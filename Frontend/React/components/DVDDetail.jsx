import { useParams, useNavigate } from "react-router-dom";
import { products } from "./ProductList";
import "../styles/dvddetail.css";

export default function DVDDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const movie = products.find(p => p.id === parseInt(id));

    if (!movie) {
        return (
            <div className="dvd-not-found">
                <h2>DVD not found.</h2>
                <button onClick={() => navigate("/catalog")}>← Back to Catalog</button>
            </div>
        );
    }

    const isOutOfStock = movie.stock === 0;
    const buyPrice = (movie.price * 5).toFixed(2);

    const renderStars = (rating) => {
        const num = parseFloat(rating) / 2; // convert out of 10 → out of 5
        const full = Math.floor(num);
        const half = num - full >= 0.5;
        return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
    };

    return (
        <div className="dvd-detail-page">
            <div className="dvd-detail-inner">
                {/* Back button */}
                <button className="back-btn" onClick={() => navigate("/catalog")}>
                    ← Back to Catalog
                </button>

                <div className="dvd-detail-layout">
                    {/* Poster */}
                    <div className="dvd-poster-wrap">
                        <img
                            src={movie.image}
                            alt={movie.name}
                            className="dvd-poster"
                            style={{ opacity: isOutOfStock ? 0.5 : 1 }}
                        />
                        {isOutOfStock && <div className="out-badge">Out of Stock</div>}
                    </div>

                    {/* Info */}
                    <div className="dvd-info">
                        <div className="dvd-meta-top">
                            <span className="dvd-category">{movie.category}</span>
                            {movie.year && <span className="dvd-year">{movie.year}</span>}
                        </div>

                        <h1 className="dvd-title">{movie.name}</h1>

                        {movie.rating && (
                            <div className="dvd-rating">
                                <span className="stars">{renderStars(movie.rating)}</span>
                                <span className="rating-num">⭐ {movie.rating} / 10</span>
                            </div>
                        )}

                        {movie.description && (
                            <p className="dvd-description">{movie.description}</p>
                        )}

                        <div className="dvd-credits">
                            {movie.director && (
                                <div className="credit-row">
                                    <span className="credit-label">Director</span>
                                    <span className="credit-value">{movie.director}</span>
                                </div>
                            )}
                            {movie.cast && (
                                <div className="credit-row">
                                    <span className="credit-label">Cast</span>
                                    <span className="credit-value">{movie.cast}</span>
                                </div>
                            )}
                            <div className="credit-row">
                                <span className="credit-label">Availability</span>
                                <span className={`credit-value ${isOutOfStock ? "stock-out" : "stock-in"}`}>
                                    {isOutOfStock ? "Currently Unavailable" : `${movie.stock} copies in stock`}
                                </span>
                            </div>
                        </div>

                        {/* Pricing + Actions */}
                        <div className="dvd-pricing">
                            <div className="price-block">
                                <span className="price-label">Rent</span>
                                <span className="price-amount">${movie.price.toFixed(2)}<small>/day</small></span>
                            </div>
                            <div className="price-divider" />
                            <div className="price-block">
                                <span className="price-label">Buy</span>
                                <span className="price-amount">${buyPrice}</span>
                            </div>
                        </div>

                        <div className="dvd-actions">
                            <button
                                className="action-btn rent"
                                disabled={isOutOfStock}
                            >
                                {isOutOfStock ? "Out of Stock" : "🛒 Rent Now"}
                            </button>
                            <button
                                className="action-btn buy"
                                disabled={isOutOfStock}
                            >
                                {isOutOfStock ? "Unavailable" : "Buy Now"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
