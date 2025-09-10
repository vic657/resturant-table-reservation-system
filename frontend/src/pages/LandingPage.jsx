import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import { FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import axiosClient from "../axiosClient"; // ✅ changed from axios
import "../index.css";

import r1 from "../assets/r1.jpg";
import r2 from "../assets/r2.jpg";
import r3 from "../assets/r3.jpg";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Simulate page load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); 
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post("/login", { email, password }); // ✅ use axiosClient
      localStorage.setItem("token", res.data.token);
      setShowLogin(false);
      setEmail("");
      setPassword("");
      setError("");
      window.location.href = "/dashboard"; // keep your original redirect
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar onLoginClick={() => setShowLogin(true)} /> 

      {/* Hero Section */}
      <section id="home" className="hero">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-text"
        >
          <h2>
            Delicious Meals, <span>Made for You</span>
          </h2>
          <p>
            Experience the best dining with our handcrafted dishes and excellent service.
          </p>
          <div className="hero-buttons">
            <Link to="/book-table">
              <button className="primary">Book a Table</button>
            </Link>
            <button className="outline">Order Online</button>
          </div>
        </motion.div>

        <motion.img
          src={r1}
          alt="Restaurant Food"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />
      </section>

      {/* Specials Section */}
      <section id="menu" className="menu">
        <h3>Our Specials</h3>
        <div className="menu-grid">
          {[
            { name: "Pasta Primavera", img: r2 },
            { name: "Grilled Steak", img: r3 },
            { name: "Seafood Delight", img: r1 },
          ].map((dish, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="menu-card"
            >
              <img src={dish.img} alt={dish.name} />
              <h4>{dish.name}</h4>
              <p>Fresh, tasty, and made with love.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="about">
        <h3>About Us</h3>
        <p>
          Welcome to our restaurant! We combine tradition with innovation to serve
          meals that not only satisfy your hunger but also delight your senses.
          Whether you're here for a family dinner or a quick bite, we promise quality
          and freshness every time.
        </p>
      </section>

      {/* Footer */}
      <footer id="contact">
        <p>© {new Date().getFullYear()} Restaurant System. All Rights Reserved.</p>

        <div className="footer-contact">
          <a href="tel:+254700000000"><FaPhoneAlt /> +254 700 000 000</a>
          <a href="#"><FaEnvelope /> info@vcsystem.com</a>
        </div>

        <div className="footer-icons">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaTwitter /></a>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="primary">Login</button>
              <button
                type="button"
                className="outline"
                onClick={() => setShowLogin(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
