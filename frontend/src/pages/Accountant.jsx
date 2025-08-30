import React, { useState, useEffect } from "react";
import axiosClient from "../axiosClient";
import AdminLayout from "./AdminLayout";

export default function Accountant() {
  const [accountant, setAccountant] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchAccountant();
  }, []);

  const fetchAccountant = async () => {
    try {
      const res = await axiosClient.get("/admin/accountant");
      setAccountant(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/admin/accountant", form);
      setSuccessMessage("Accountant created successfully!");
      setErrorMessage("");
      setForm({ name: "", email: "", password: "" });
      fetchAccountant();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setErrorMessage("Failed to create accountant. Please try again.");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("⚠️ WARNING: Are you sure you want to remove the accountant? This action cannot be undone!")) {
      return;
    }
    try {
      await axiosClient.delete(`/admin/accountant/${accountant.id}`);
      setSuccessMessage("Accountant removed successfully!");
      setErrorMessage("");
      setAccountant(null);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setErrorMessage("Failed to remove accountant.");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  return (
    <AdminLayout>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff8f0",
          borderRadius: "10px",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
          maxWidth: "600px",
          margin: "20px auto",
        }}
      >
        <h2
          style={{
            color: "#e65100",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Accountant Management
        </h2>

        {/* Success Message */}
        {successMessage && (
          <div
            style={{
              backgroundColor: "#4caf50",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div
            style={{
              backgroundColor: "#f44336",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {errorMessage}
          </div>
        )}

        {!accountant ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#e65100", fontWeight: "bold" }}>Name:</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  marginTop: "5px",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#e65100", fontWeight: "bold" }}>Email:</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  marginTop: "5px",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#e65100", fontWeight: "bold" }}>Password:</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  marginTop: "5px",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: "#ff5722",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Create Accountant
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <h3 style={{ color: "#d32f2f" }}>⚠️ Accountant Already Exists</h3>
            <p style={{ color: "#f57c00" }}>
              Only one accountant can exist in the system.  
              Removing will permanently delete their account.
            </p>
            <p>
              <strong>Name:</strong> {accountant.name} <br />
              <strong>Email:</strong> {accountant.email}
            </p>
            <button
              onClick={handleDelete}
              style={{
                backgroundColor: "#d32f2f",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              Remove Accountant
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
