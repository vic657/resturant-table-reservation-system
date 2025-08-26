import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

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
      <Navbar />
      <div className="dashboard-container">
        <h1>Welcome Admin Dashboard</h1>
      </div>
    </>
  );
}

export default AdminDashboard;
