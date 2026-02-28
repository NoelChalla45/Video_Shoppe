import { useNavigate } from "react-router-dom";
import "../styles/hero.css";

const CATEGORIES = [
    { icon: "🎬", label: "New Releases" },
    { icon: "🔥", label: "Trending" },
    { icon: "🏆", label: "Top Rated" },
    { icon: "😂", label: "Comedy" },
    { icon: "👻", label: "Horror" },
    { icon: "🚀", label: "Sci-Fi" },
    { icon: "❤️", label: "Romance" },
    { icon: "🎭", label: "Drama" },
];

const FEATURED = [
    { title: "Inception", year: 2010, genre: "Sci-Fi / Thriller", rating: "8.8", img: "https://s3.amazonaws.com/nightjarprod/content/uploads/sites/130/2021/08/19090041/9gk7adHYeDvHkCSEqAvQNLV5Uge-scaled.jpg" },
    { title: "The Dark Knight", year: 2008, genre: "Action / Crime", rating: "9.0", img: "https://m.media-amazon.com/images/I/91KkWf50SoL._AC_UF894,1000_QL80_.jpg" },
    { title: "Interstellar", year: 2014, genre: "Sci-Fi / Drama", rating: "8.6", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwLxpRYgsPOliVFNFWURt16sM3GS0boxruFvrsOCGPVJDyzefdlol78fgU9J9icT0Vw2os&s=10" },
    { title: "Pulp Fiction", year: 1994, genre: "Crime / Drama", rating: "8.9", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlLZ9YD1faDba-jst-393J9ilvVMFUigTSeg&s" },
    { title: "The Matrix", year: 1999, genre: "Sci-Fi / Action", rating: "8.7", img: "https://m.media-amazon.com/images/I/613ypTLZHsL._AC_UF1000,1000_QL80_.jpg" },
    { title: "Forrest Gump", year: 1994, genre: "Drama / Romance", rating: "8.8", img: "https://cdn.planetakino.ua/old-movie-files/00000000000000000000000000002104/opt_null" },
];

export default function Hero() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const firstName = user?.name ? user.name.split(" ")[0] : null;

    return (
        <div className="home-page">
            {/* Hero Banner */}
            <header className="hero" id="home">
                <div className="overlay"></div>
                <div className="hero-contents">
                    <p className="hero-eyebrow">🎬 Now Streaming &amp; Available to Rent</p>
                    <h1>
                        {firstName ? `Welcome back, ${firstName}.` : "Welcome to"} <span>Video Shoppe!</span>
                    </h1>
                    <p>Thousands of DVDs &amp; Blu-rays. Rent online, pick up in store.</p>
                    <div className="hero-buttons">
                        <button onClick={() => navigate("/catalog")}>Browse Catalog</button>
                        <button className="outline" onClick={() => navigate("/alerts")}>Rental Alerts</button>
                    </div>
                </div>
            </header>

            {/* Categories */}
            <section className="section categories-section">
                <h2 className="section-title">Browse by Genre</h2>
                <div className="categories-grid">
                    {CATEGORIES.map(cat => (
                        <div className="category-chip" key={cat.label}>
                            <span className="cat-icon">{cat.icon}</span>
                            <span>{cat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Titles */}
            <section className="section featured-section">
                <h2 className="section-title">Featured Titles</h2>
                <div className="featured-grid">
                    {FEATURED.map(movie => (
                        <div className="movie-card" key={movie.title}>
                            <img src={movie.img} alt={movie.title} className="movie-poster" />
                            <div className="movie-info">
                                <h3 className="movie-title">{movie.title}</h3>
                                <p className="movie-meta">{movie.year} · {movie.genre}</p>
                                <div className="movie-rating">⭐ {movie.rating}</div>
                                <button className="rent-btn">Rent Now</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Banner CTA */}
            <section className="promo-banner">
                <div className="promo-content">
                    <h2>New arrivals every Friday.</h2>
                    <p>Set up rental alerts and never miss a new release.</p>
                    <button onClick={() => navigate("/alerts")}>Set Up Alerts</button>
                </div>
            </section>
        </div>
    );
}

