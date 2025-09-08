import { useState, useEffect } from "react";
import axiosClient from "../axiosClient";
import AdminLayout from "./AdminLayout";
import "../Security.css"; // Import CSS for responsiveness

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

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch security guards
  const fetchSecurities = async () => {
    try {
      const res = await axiosClient.get("/admin/securities");
      setSecurities(res.data);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to fetch security guards.");
    }
  };

  useEffect(() => {
    fetchSecurities();
  }, []);

  // Auto-hide messages
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add/update guard
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
      console.error(err);
      setErrorMessage("Failed to save security guard.");
    }
  };

  // Edit guard
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

  // Delete guard
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
      console.error(err);
      setErrorMessage("Failed to delete security guard.");
    }
  };

  return (
    <AdminLayout>
      <div className="security-container">
        <h2>Security Guards Management</h2>

        {successMessage && <div className="security-message success">{successMessage}</div>}
        {errorMessage && <div className="security-message error">{errorMessage}</div>}

        <form className="security-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <select name="shift" value={form.shift} onChange={handleChange} required>
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
          />
          <button type="submit">{editingId ? "Update Guard" : "Add Guard"}</button>
        </form>

        <div className="table-responsive">
          <table className="security-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Shift</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {securities.length > 0 ? (
                securities.map((security) => (
                  <tr key={security.id}>
                    <td>{security.name}</td>
                    <td>{security.email}</td>
                    <td>{security.phone}</td>
                    <td>{security.shift}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(security)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(security.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-row">No security guards found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
