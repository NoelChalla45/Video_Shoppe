/*Idea: On account page, have a log out button that sends you back to the login screen*/
import "../styles/navbar.css";
import { Link } from "react-router-dom";


export default function Navbar() {
    return(
        <nav className="navbar">
            <h2 className="logo">Video Shoppe</h2>
            <ul className="nav-links">
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/catalog">DVD Catalog</Link></li>
                <li><Link to="/alerts">Rental Alerts</Link></li>
                <li><Link to="/account">Account</Link></li>
            </ul> 

           {/*<button className="login-btn">Login</button>*/}
        </nav>
    )
}
