import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const getInitials = (user) => {
        if (!user) return "?";
        if (user.name) {
            return user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
        }
        return user.email[0].toUpperCase();
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return(
        <nav className="navbar">
            <h2 className="logo">🎬 Video Shoppe</h2>
            <ul className="nav-links">
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/catalog">DVD Catalog</Link></li>
                <li><Link to="/alerts">Rental Alerts</Link></li>
                <li><Link to="/account">Account</Link></li>
                <li><Link to="/cart">Cart</Link></li>
            </ul>
            <div className="nav-user">
                {user && (
                    <>
                        <div className="user-avatar" title={user.name || user.email}>
                            {getInitials(user)}
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
                    </>
                )}
            </div>
        </nav>
    );
}

