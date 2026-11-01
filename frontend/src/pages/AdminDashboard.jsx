import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "./Sidebar";
export default function AdminDashboard() {
  return <><Navbar /><Sidebar /><main className="admin-content"><span className="eyebrow">YOUR RESTAURANT WORKSPACE</span><h1>Welcome back.</h1><p>Keep your team organised and your service running smoothly.</p><div className="admin-quick-links">{[["Waiters","Manage the team taking care of your guests.","/waiters"],["Kitchen managers","Manage kitchen staff accounts.","/admin/kitchen-manager"],["Security","Manage your security team.","/admin/security"],["Accountants","Manage accounting staff accounts.","/admin/accountant"]].map(([name,text,to])=><Link key={to} to={to}><span className="eyebrow">STAFF MANAGEMENT ↗</span><h2>{name}</h2><p>{text}</p></Link>)}</div></main></>;
}