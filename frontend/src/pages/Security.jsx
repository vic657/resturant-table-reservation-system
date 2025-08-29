import { useState, useEffect } from "react";
import axiosClient from "../axiosClient";
import AdminLayout from "./AdminLayout";

export default function Security() {
  const [securities, setSecurities] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    shift: "",
    password: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Success/Error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch securities list
  const fetchSecurities = async () => {
    try {
      const res = await axiosClient.get("/admin/securities");
      setSecurities(res.data);
    } catch (err) {
      console.error("Error fetching securities:", err);
      setErrorMessage("Failed to fetch security guards.");
    }
  };

  useEffect(() => {
    fetchSecurities();
  }, []);

  // Auto-hide messages after 3 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update security guard
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (editingId) {
        await axiosClient.put(`/admin/securities/${editingId}`, form);
        setSuccessMessage("Security guard updated successfully!");
      } else {
        await axiosClient.post("/admin/securities", form);
        setSuccessMessage("Security guard added successfully!");
      }
      setForm({ name: "", email: "", phone: "", shift: "", password: "" });
      setEditingId(null);
      fetchSecurities();
    } catch (err) {
      console.error("Error saving security:", err);
      setErrorMessage("Failed to save security guard.");
    }
  };

  // Edit security guard
  const handleEdit = (security) => {
    setForm({
      name: security.name,
      email: security.email,
      phone: security.phone,
      shift: security.shift,
      password: "",
    });
    setEditingId(security.id);
  };

  // Delete security guard
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this security guard?"))
      return;

    setSuccessMessage("");
    setErrorMessage("");

    try {
      await axiosClient.delete(`/admin/securities/${id}`);
      setSuccessMessage("Security guard deleted successfully!");
      fetchSecurities();
    } catch (err) {
      console.error("Error deleting security:", err);
      setErrorMessage("Failed to delete security guard.");
    }
  };

  return (
    <AdminLayout>
      <div
        style={{
          padding: "20px",
          background: "#fff3e0",
          minHeight: "100vh",
          marginLeft: "250px", // ✅ leave space for sidebar
        }}
      >
        <h2 style={{ color: "#e65100", textAlign: "center" }}>
          Security Guards Management
        </h2>

        {/* Success Message */}
        {successMessage && (
          <div
            style={{
              background: "#c8e6c9",
              color: "#256029",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              transition: "opacity 0.5s ease-in-out",
            }}
          >
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div
            style={{
              background: "#ffcdd2",
              color: "#c62828",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              transition: "opacity 0.5s ease-in-out",
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Security Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: "20px",
            marginBottom: "30px",
            padding: "20px",
            background: "#ffe0b2",
            borderRadius: "8px",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ marginRight: "10px", padding: "8px" }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ marginRight: "10px", padding: "8px" }}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            required
            style={{ marginRight: "10px", padding: "8px" }}
          />
          <select
            name="shift"
            value={form.shift}
            onChange={handleChange}
            required
            style={{ marginRight: "10px", padding: "8px" }}
          >
            <option value="">Select Shift</option>
            <option value="Day">Day Shift</option>
            <option value="Night">Night Shift</option>
          </select>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required={!editingId}
            style={{ marginRight: "10px", padding: "8px" }}
          />
          <button
            type="submit"
            style={{
              background: "#ff5722",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "5px",
            }}
          >
            {editingId ? "Update Guard" : "Add Guard"}
          </button>
        </form>

        {/* Securities List */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
          }}
        >
          <thead>
            <tr style={{ background: "#ffcc80" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Phone</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Shift</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {securities.map((security) => (
              <tr key={security.id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {security.name}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {security.email}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {security.phone}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {security.shift}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <button
                    onClick={() => handleEdit(security)}
                    style={{
                      marginRight: "10px",
                      background: "#ff9800",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(security.id)}
                    style={{
                      background: "#f44336",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {securities.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "20px", color: "#777" }}
                >
                  No security guards found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
