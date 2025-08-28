import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import SidebarLayout from "../pages/Sidebar.jsx";

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar + Content */}
      <div style={{ display: "flex" }}>
        <SidebarLayout>
          <div className="dashboard-content" style={{ padding: "20px" }}>
            <h1>Welcome Admin Dashboard</h1>
            <p>Here you can manage users, view reports, and configure system settings.</p>
          </div>
        </SidebarLayout>
      </div>
    </>
  );
}

export default AdminDashboard;
