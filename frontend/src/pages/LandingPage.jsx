import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../Components/ui/Button";
import "../index.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

import r1 from "../assets/r1.jpg";
import r2 from "../assets/r2.jpg";
import r3 from "../assets/r3.jpg";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);

  // Simulate page load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5s loader
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Navbar */}
      <nav>
        <h1>VC'RestaurantSystem</h1>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#menu">Menu</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button>Login</button>
      </nav>

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
            <button className="primary">Book a Table</button>
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
    </div>
  );
}
