import { useCallback, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import { dashboardPaths, getUser, logout } from "../auth";

export default function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getUser);
  const [signingOut, setSigningOut] = useState(false);
  const navigate = useNavigate();
  const closeLogin = useCallback(() => setLoginOpen(false), []);
  const handleLogout = async () => {
    setSigningOut(true);
    try { await logout(); }
    catch { /* Local credentials are cleared even if the service is unavailable. */ }
    finally { setUser(null); setSigningOut(false); navigate("/"); }
  };
  return <>
    <nav className="navbar" aria-label="Main navigation">
      <Link to="/" className="brand"><span className="brand-mark">vc.</span><span>VC Restaurant<small>GOOD FOOD. GOOD COMPANY.</small></span></Link>
      <button className="nav-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="main-links" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "×" : "☰"}</button>
      <div id="main-links" className={`nav-content ${menuOpen ? "is-open" : ""}`}>
        <ul className="navbar-links" onClick={() => setMenuOpen(false)}>
          <li><NavLink to="/" end>Home</NavLink></li><li><NavLink to="/menu">Our menu</NavLink></li>
          <li><Link to="/#about">Our story</Link></li>
          {user && <li><Link to={dashboardPaths[localStorage.getItem("role")] || "/"}>Workspace</Link></li>}
        </ul>
        {user ? <button className="navbar-btn" disabled={signingOut} onClick={handleLogout}>{signingOut ? "Signing out…" : "Sign out"}</button> : <button className="staff-login" onClick={() => { setMenuOpen(false); setLoginOpen(true); }}>Staff sign in</button>}
        <Link className="navbar-btn" to="/book-table" onClick={() => setMenuOpen(false)}>Reserve a table ↗</Link>
      </div>
    </nav>
    {loginOpen && <LoginModal onClose={closeLogin} />}
  </>;
}