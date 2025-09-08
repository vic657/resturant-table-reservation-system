import { useState } from "react";
import AdminLayout from "./AdminLayout";
import axiosClient from "../axiosClient";
import "../KitchenManager.css"; // Import CSS

export default function KitchenManager() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    try {
      await axiosClient.post("/kitchen-managers", form);
      setMessage({ type: "success", text: "Kitchen Manager registered successfully!" });
      setForm({ name: "", email: "", password: "" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to register kitchen manager",
      });
    }

    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <AdminLayout>
      <div className="kitchen-container">
        <h2>Kitchen Manager</h2>

        <form className="kitchen-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Register Kitchen Manager</button>
        </form>

        {message && (
          <div className={`kitchen-message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
