import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { dashboardPaths } from "../auth";

export default function LoginModal({ onClose, standalone = false }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const previous = document.activeElement;
    formRef.current?.querySelector("input")?.focus();
    const keydown = event => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const controls = [...formRef.current.querySelectorAll("button, input")].filter(el => !el.disabled);
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", keydown);
    const overflow = document.body.style.overflow;
    if (!standalone) document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", keydown); document.body.style.overflow = overflow; previous?.focus(); };
  }, [onClose, standalone]);
  const submit = async event => {
    event.preventDefault();
    if (pending) return;
    setPending(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const { data: result } = await axiosClient.post("/login", { email: data.get("email"), password: data.get("password") });
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("role", result.role);
      navigate(dashboardPaths[result.role] || "/", { replace: true });
      if (!standalone) onClose();
    } catch (err) {
      setError(err.response?.status === 429 ? "Too many attempts. Please wait a minute." : err.response?.status === 401 ? "Email or password is incorrect." : "Unable to sign in. Please try again.");
    } finally { setPending(false); }
  };
  return <div className={standalone ? "login-page" : "modal-overlay"} onClick={e => { if (!standalone && e.target === e.currentTarget) onClose(); }}>
    <div className="modal-content" ref={formRef} role={standalone ? undefined : "dialog"} aria-modal={standalone ? undefined : true} aria-labelledby="login-title">
      <button onClick={onClose} className="modal-close" aria-label="Close sign in">×</button>
      <span className="eyebrow">VC RESTAURANT · STAFF ACCESS</span>
      <h2 id="login-title">Welcome back.</h2>
      <p className="login-description">Sign in to your workspace.</p>
      {error && <p className="modal-error" role="alert">{error}</p>}
      <form onSubmit={submit}>
        <label htmlFor="login-email">Email address</label>
        <input id="login-email" name="email" type="email" autoComplete="username" required maxLength={255} placeholder="you@example.com" />
        <label htmlFor="login-password">Password</label>
        <input id="login-password" name="password" type="password" autoComplete="current-password" required placeholder="Your password" />
        <button className="modal-button" disabled={pending}>{pending ? "Signing in…" : "Sign in →"}</button>
      </form>
    </div>
  </div>;
}