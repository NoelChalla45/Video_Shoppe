import "../styles/hero.css";

export default function Hero() {
  return (
    <header className="hero" id="home">
        <div className="overlay"></div>
        <div className="hero-contents">
            <h1>
                Welcome to <span>Video Shoppe!</span>
            </h1>
            <p>Your one-stop shop for all your video needs.</p>

            <div className="hero-buttons">
                <button>Shop Now</button>
                {/*<button className="outline">Login</button>*/} {/*Removes button from home menu*/}
            </div>
        </div>
    </header>
  );
}
