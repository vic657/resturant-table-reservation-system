import { Link } from "react-router-dom";
import "../index.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-logo">VC'RestaurantSystem</h1>
      <ul className="navbar-links">
        <li><a href="/">Home</a></li>
        <li><a href="#menu">Menu</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <Link to="/login">
        <button className="navbar-btn">Login</button>
      </Link>
    </nav>
  );
}
