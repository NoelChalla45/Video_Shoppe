import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/dvddetail.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function DVDDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchMovie = async () => {
        try {
            console.log("Fetching movie with ID:", id);
            
            const response = await fetch(`${API}/api/inventory/${id}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error message:", errorData.error);
                throw new Error("Movie not found");
            }

            const data = await response.json();
            setMovie(data);
        } catch (err) {
            console.error("Fetch error details:", err);
            setMovie(null);
        } finally {
            setLoading(false);
        }
    };

    if (id) fetchMovie();
}, [id]);

    // ─── Loading  & Error Screens ─────────────────────────────────
    if (loading) {
        return (
            <div className="dvd-detail-page">
                <div className="loading-container">
                    <span className="spinner"></span>
                    <h2>Loading Movie Details...</h2>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="dvd-not-found">
                <h2>🎬 Movie not found.</h2>
                <p>We couldn't find the DVD you're looking for.</p>
                <button onClick={() => navigate("/catalog")}>← Back to Catalog</button>
            </div>
        );
    }

    // ─── Logic ──────────────────────
    const isOutOfStock = movie.stock === 0;
    const moviePrice = movie.price || 0;
    const buyPrice = (moviePrice * 5).toFixed(2);

    const renderStars = (rating) => {
        if (!rating) return "☆☆☆☆☆";
        const num = parseFloat(rating) / 2;
        const full = Math.floor(num);
        const half = num - full >= 0.5;
        return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(Math.max(0, 5 - full - (half ? 1 : 0)));
    };

    return (
        <div className="dvd-detail-page">
            <div className="dvd-detail-inner">
                <button className="back-btn" onClick={() => navigate("/catalog")}>
                    ← Back to Catalog
                </button>

                <div className="dvd-detail-layout">
                    <div className="dvd-poster-wrap">
                        <img
                            src={movie.image || "/placeholder-dvd.png"}
                            alt={movie.name}
                            className="dvd-poster"
                            style={{ opacity: isOutOfStock ? 0.5 : 1 }}
                        />
                        {isOutOfStock && <div className="out-badge">Out of Stock</div>}
                    </div>

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

                        <div className="dvd-pricing">
                            <div className="price-block">
                                <span className="price-label">Rent</span>
                                <span className="price-amount">${moviePrice.toFixed(2)}<small>/day</small></span>
                            </div>
                            <div className="price-divider" />
                            <div className="price-block">
                                <span className="price-label">Buy</span>
                                <span className="price-amount">${buyPrice}</span>
                            </div>
                        </div>

                        <div className="dvd-actions">
                            <button className="action-btn rent" disabled={isOutOfStock}>
                                {isOutOfStock ? "Out of Stock" : "🛒 Rent Now"}
                            </button>
                            <button className="action-btn buy" disabled={isOutOfStock}>
                                {isOutOfStock ? "Unavailable" : "Buy Now"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
