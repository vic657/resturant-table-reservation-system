import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../index.css";
import LoginModal from "./LoginModal";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const scrollToSection = (id) => {
    if (location.pathname === "/") {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <>
      <nav className="navbar">
  <h1 className="navbar-logo">VC'RestaurantSystem</h1>
  <ul className="navbar-links">
    <li><Link to="/">Home</Link></li>
    <li><Link to="/menu">Menu</Link></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>

        {!user ? (
          <button className="navbar-btn" onClick={() => setIsLoginOpen(true)}>
            Login
          </button>
        ) : (
          <div
            className="user-menu"
            onMouseEnter={() => window.innerWidth > 768 && setDropdownOpen(true)}
            onMouseLeave={() => window.innerWidth > 768 && setDropdownOpen(false)}
            onClick={() => setDropdownOpen(!dropdownOpen)} // click toggle for mobile
          >
            <FaUserCircle className="user-icon" />
            {dropdownOpen && (
              <div className="dropdown">
                <p className="dropdown-username">{user.name}</p>
                <button className="dropdown-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </>
  );
}
