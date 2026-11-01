import Navbar from "../Components/Navbar";
import Sidebar from "./Sidebar";
export default function AdminLayout({ children }) {
  return <><Navbar /><Sidebar /><main className="admin-content">{children}</main></>;
}