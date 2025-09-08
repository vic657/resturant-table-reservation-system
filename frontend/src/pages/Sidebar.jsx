import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaList,
  FaCog,
  FaSignOutAlt,
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

  return (
    <>
      {/* Mobile toggle button */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <h2 className="sidebar-logo">Admin Panel</h2>
        <ul className="sidebar-links">
          <li>
            <Link to="/admin/dashboard">
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
                  <Link to="/waiters">
                    Waiters
                  </Link>
                </li>
                <li>
                  <Link to="/admin/security">Security</Link>
                </li>
                <li>
                  <Link to="/admin/accountant">Accountant</Link>
                </li>
                <li>
                  <Link to="/admin/kitchen-manager">Kitchen Manager</Link>
                </li>
              </ul>
            )}
          </li>

          
        </ul>
        
      </div>
    </>
  );
}
