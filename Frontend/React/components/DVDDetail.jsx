import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/dvddetail.css";
import { addItemToCart } from "../utils/cart";
import { canAddRentalToCart } from "../utils/rentalRules";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function DVDDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isEmployeeView = user?.role === "EMPLOYEE" || user?.role === "OWNER";

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await fetch(`${API}/api/inventory/${id}`);

                if (!response.ok) {
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

    if (loading) {
        return (
            <div className="dvd-detail-page">
                <div className="loading-container">
                    <span className="detail-spinner"></span>
                    <h2>Loading Movie Details...</h2>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="dvd-not-found">
                <h2>Movie not found.</h2>
                <p>We could not find the DVD you are looking for.</p>
                <button className="not-found-btn" onClick={() => navigate("/catalog")}>Back to Catalog</button>
            </div>
        );
    }

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

    const handleAction = (mode) => {
        if (mode === "rent") {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            const limitCheck = canAddRentalToCart(user, 1);
            if (!limitCheck.allowed) {
                setFeedback("");
                setError(`You can only rent up to ${limitCheck.maxAllowed} DVDs at a time.`);
                return;
            }
        }

        addItemToCart(movie, mode);
        setError("");
        setFeedback(`${movie.name} added to cart for ${mode}.`);
        navigate("/cart");
    };

    return (
        <div className="dvd-detail-page">
            <div className="dvd-detail-inner">
                <button className="back-btn" onClick={() => navigate("/catalog")}>
                    Back to Catalog
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
                                <span className="rating-num">{movie.rating} / 10</span>
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
                                    {isOutOfStock ? "Currently unavailable" : `${movie.stock} copies in stock`}
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
                            {isEmployeeView ? (
                                <p className="dvd-staff-note">
                                    Employee view: browsing + stock visibility only. Renting and buying are customer-only actions.
                                </p>
                            ) : (
                                <>
                                    <button className="action-btn rent" disabled={isOutOfStock} onClick={() => handleAction("rent")}>
                                        {isOutOfStock ? "Out of Stock" : "Rent Now"}
                                    </button>
                                    <button className="action-btn buy" disabled={isOutOfStock} onClick={() => handleAction("buy")}>
                                        {isOutOfStock ? "Unavailable" : "Buy Now"}
                                    </button>
                                </>
                            )}
                        </div>
                        {feedback && <p className="dvd-feedback">{feedback}</p>}
                        {error && <p className="dvd-error">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
