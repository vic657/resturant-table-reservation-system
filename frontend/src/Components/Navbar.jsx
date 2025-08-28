import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 import navigate
import "../index.css";
import LoginModal from "./LoginModal";
import { FaUserCircle } from "react-icons/fa"; // 👈 for user icon

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // 👈 initialize navigate

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // 👈 now it works
  };

  return (
    <>
      <nav className="navbar">
        <h1 className="navbar-logo">VC'RestaurantSystem</h1>
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li><a href="#menu">Menu</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        {/* Right side */}
        {!user ? (
          <button
            className="navbar-btn"
            onClick={() => setIsLoginOpen(true)}
          >
            Login
          </button>
        ) : (
          <div
            className="user-menu"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
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

      {/* Login Modal */}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </>
  );
}
