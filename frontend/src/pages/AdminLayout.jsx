import { useState } from "react";
import "../index.css";
import { FaBars, FaTachometerAlt, FaUsers, FaUtensils, FaCog, FaSignOutAlt } from "react-icons/fa";

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <h2 className="sidebar-logo">Admin</h2>
        <ul className="sidebar-links">
          <li><FaTachometerAlt /> Dashboard</li>
          <li><FaUsers /> Manage Users</li>
          <li><FaUtensils /> Manage Menu</li>
          <li><FaCog /> Settings</li>
          <li><FaSignOutAlt /> Logout</li>
        </ul>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <FaBars className="menu-toggle" onClick={() => setIsOpen(!isOpen)} />
          <h1>Admin Panel</h1>
        </div>

        {/* Page Content */}
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
