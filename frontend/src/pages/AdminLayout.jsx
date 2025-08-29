import { useState } from "react";
import "../index.css";
import Navbar from "../Components/Navbar.jsx";       // Top Navbar
import Sidebar from "../Pages/Sidebar.jsx";         // Sidebar from pages

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} />

      {/* Main content */}
      <div className="main-content">
        {/* Top Navbar */}
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />

        {/* Page Content */}
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
