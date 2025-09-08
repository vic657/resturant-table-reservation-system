import { useEffect, useState } from "react";
import AdminLayout from './AdminLayout';
import axiosClient from "../axiosClient";
import "../Waiters.css"; 

export default function Waiters() {
  const [waiters, setWaiters] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    shift: "",
    password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchWaiters();
  }, []);

  const fetchWaiters = async () => {
    try {
      const res = await axiosClient.get("/admin/waiters");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setWaiters(data);
    } catch (err) {
      console.error("Error fetching waiters:", err.response?.data || err.message);
      setWaiters([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/admin/waiters", form);
      setForm({ name: "", email: "", phone: "", shift: "", password: "" });
      setMessage({ type: "success", text: "Waiter registered successfully!" });
      fetchWaiters();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to add waiter. Please try again." });
      console.error("Error adding waiter:", err.response?.data || err.message);
    }
    setTimeout(() => setMessage({ type: "", text: "" }), 3000); // Auto hide msg
  };

  return (
    <AdminLayout>
    <div className="waiters-container">
      <h2>Waiters Management</h2>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="waiter-form">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Shift"
          value={form.shift}
          onChange={(e) => setForm({ ...form, shift: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Add Waiter</button>
      </form>

      <h3>Available Waiters</h3>
      {waiters.length > 0 ? (
        <table className="waiters-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Shift</th>
            </tr>
          </thead>
          <tbody>
            {waiters.map((w) => (
              <tr key={w.id}>
                <td>{w.name}</td>
                <td>{w.email}</td>
                <td>{w.phone}</td>
                <td>{w.shift}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty">No waiters found.</p>
      )}
    </div>
    </AdminLayout>
  );
}
