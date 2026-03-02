import "../styles/navbar.css";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const getInitials = (currentUser) => {
        if (!currentUser) return "?";
        if (currentUser.name) {
            return currentUser.name.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2);
        }
        return currentUser.email[0].toUpperCase();
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const navClass = ({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`;

    return (
        <nav className="navbar">
            <NavLink to="/home" className="brand-link" aria-label="Video Shoppe home">
                <span className="brand-icon">VS</span>
                <span className="logo">Video Shoppe</span>
            </NavLink>

            <ul className="nav-links">
                <li><NavLink to="/home" className={navClass}>Home</NavLink></li>
                <li><NavLink to="/catalog" className={navClass}>DVD Catalog</NavLink></li>
                <li><NavLink to="/alerts" className={navClass}>Rental Alerts</NavLink></li>
                <li><NavLink to="/account" className={navClass}>Account</NavLink></li>
                <li><NavLink to="/cart" className={navClass}>Cart</NavLink></li>
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
