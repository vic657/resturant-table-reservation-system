import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaHome,
  FaAngleDown,
  FaAngleRight,
  FaBars,
} from "react-icons/fa";
import "../Sidebar.css";

export default function Sidebar({ onLogout }) {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSupport = () => setIsSupportOpen(!isSupportOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <h2 className="sidebar-logo">Admin Panel</h2>
        <ul className="sidebar-links">
          <li>
            <Link to="/admin/dashboard" onClick={closeSidebar}>
              <FaHome /> Dashboard
            </Link>
          </li>

          {/* Support Staff with dropdown */}
          <li>
            <button className="sidebar-dropdown" onClick={toggleSupport}>
              <FaUsers /> Support Staff{" "}
              {isSupportOpen ? <FaAngleDown /> : <FaAngleRight />}
            </button>
            {isSupportOpen && (
              <ul className="sidebar-submenu">
                <li>
                  <Link to="/waiters" onClick={closeSidebar}>
                    Waiters
                  </Link>
                </li>
                <li>
                  <Link to="/admin/security" onClick={closeSidebar}>
                    Security
                  </Link>
                </li>
                <li>
                  <Link to="/admin/accountant" onClick={closeSidebar}>
                    Accountant
                  </Link>
                </li>
                <li>
                  <Link to="/admin/kitchen-manager" onClick={closeSidebar}>
                    Kitchen Manager
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Overlay for mobile (click to close sidebar) */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
    </>
  );
}
