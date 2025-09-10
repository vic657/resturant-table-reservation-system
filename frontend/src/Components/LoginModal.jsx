import { useState } from "react";
import axiosClient from "../axiosClient"; // ✅ use configured client
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
      const res = await axiosClient.post("/login", {
        email,
        password,
      });

      // Save token + user + role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.role);

      // ✅ Role-based redirects
      switch (res.data.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "kitchen_manager":
          navigate("/kitchen-manager/dashboard");
          break;
        case "waiter":
          navigate("/waiter/dashboard");
          break;
        case "security":
          navigate("/security/dashboard");
          break;
        case "accountant":
          navigate("/accountant/dashboard");
          break;
        default:
          navigate("/"); // fallback → regular user
      }

      onClose();
    } catch (err) {
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
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="modal-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
