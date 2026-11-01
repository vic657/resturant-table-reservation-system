import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { getUser } from "../auth";
export default function ProtectedRoute({ roles, children }) {
  const [status, setStatus] = useState("checking");
  useEffect(() => {
    let active = true;
    if (!localStorage.getItem("token")) { setStatus("denied"); return; }
    axiosClient.get("/me").then(() => { if (active) setStatus("ready"); }).catch(() => { if (active) setStatus("denied"); });
    return () => { active = false; };
  }, []);
  if (!getUser() || !roles.includes(localStorage.getItem("role")) || status === "denied") return <Navigate to="/login" replace />;
  if (status === "checking") return <div className="workspace-loading" role="status">Opening your workspace…</div>;
  return children;
}