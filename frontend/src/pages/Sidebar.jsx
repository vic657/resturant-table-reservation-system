import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaList, FaCog, FaSignOutAlt, FaHome, FaAngleDown, FaAngleRight } from "react-icons/fa";
import "../index.css";

export default function Sidebar({ onLogout }) {
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const toggleSupport = () => {
    setIsSupportOpen(!isSupportOpen);
  };

  return (
    <div className="sidebar">
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
            <FaUsers /> Support Staff {isSupportOpen ? <FaAngleDown /> : <FaAngleRight />}
          </button>
          {isSupportOpen && (
            <ul className="sidebar-submenu">
              <li>
                <Link to="/waiters" className="flex items-center gap-2">
                  <i className="fas fa-user-friends"></i>
                  Waiters
                </Link>
              </li>
              <li>
                <Link to="/admin/security">Security</Link>
              </li>
              <li>
                <Link to="/accountant">Accountant</Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link to="/admin/listings">
            <FaList /> Listings
          </Link>
        </li>
        <li>
          <Link to="/admin/settings">
            <FaCog /> Settings
          </Link>
        </li>
      </ul>
      <button className="sidebar-logout" onClick={onLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}
