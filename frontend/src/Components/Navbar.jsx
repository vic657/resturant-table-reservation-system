import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // redirect to landing page
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

        {!user ? (
          <button
            className="navbar-btn"
            onClick={() => setIsLoginOpen(true)}
          >
            Login
          </button>
        ) : (
          <div
            className="user-dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <span className="user-icon">👤</span>
            {dropdownOpen && (
              <div
                className="dropdown-menu"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  zIndex: 100,
                }}
              >
                <p style={{ margin: "5px 0" }}>
                  {user.name || user.email}
                </p>
                <button
                  onClick={handleLogout}
                  style={{
                    background: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {isLoginOpen && (
        <LoginModal
          onClose={() => {
            setIsLoginOpen(false);
            const storedUser = localStorage.getItem("user");
            if (storedUser) setUser(JSON.parse(storedUser));
          }}
        />
      )}
    </>
  );
}
