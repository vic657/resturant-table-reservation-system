import { useState } from "react";
import AdminLayout from "./AdminLayout";
import axiosClient from "../axiosClient"; // 👈 use your axios setup

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
      await axiosClient.post("/kitchen-managers", form); // 👈 API call
      setMessage({
        type: "success",
        text: "Kitchen Manager registered successfully!",
      });
      setForm({ name: "", email: "", password: "" });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to register kitchen manager",
      });
    }

    // auto-clear message after 4s
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <AdminLayout>
      <div
        style={{
          marginLeft: "260px", // same width as your sidebar
          padding: "30px",
          minHeight: "100vh",
          backgroundColor: "#fffaf5",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "red",
            marginBottom: "20px",
            fontWeight: "bold",
            fontSize: "24px",
          }}
        >
          Kitchen Manager
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            background: "#fff8f0",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "bold",
              background: "linear-gradient(to right, red, orange, gold)",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.3s ease",
            }}
          >
            Register Kitchen Manager
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: "bold",
              background: message.type === "error" ? "#ffe0e0" : "#e6ffe6",
              color: message.type === "error" ? "red" : "green",
              maxWidth: "500px",
              marginLeft: "auto",
              marginRight: "auto",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            {message.text}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
