import { useState } from "react";
import axios from "axios";
import "../index.css";
import { useNavigate } from "react-router-dom";

function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      // Save token + user + role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.role);

      // Decide redirect based on role
      if (res.data.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.data.role === "kitchen_manager") {
        navigate("/kitchen-manager/dashboard");
      } else if (res.data.role === "waiter") {
        navigate("/waiter/dashboard");
      } else if (res.data.role === "security") {
        navigate("/security/dashboard");
      } else if (res.data.role === "accountant") {
        navigate("/accountant/dashboard");
      } else {
        navigate("/"); // fallback regular user
      }

      onClose();
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">
          ✕
        </button>

        <h2 className="modal-title">Login</h2>
        {error && <p className="modal-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="modal-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="modal-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="modal-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
