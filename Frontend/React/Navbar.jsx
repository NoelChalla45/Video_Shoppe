import "../styles/navbar.css";

export default function Navbar() {
    return(
        <nav className="navbar">
            <h2 className="logo">Video Shoppe</h2>
            <ul className="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#catalog">DVD Catalog</a></li>
                <li><a href="#alerts">Rental Alerts</a></li>
                <li><a href="#account">Account</a></li>
            </ul> 

            <button className="login-btn">Login</button>
        </nav>
    )
}