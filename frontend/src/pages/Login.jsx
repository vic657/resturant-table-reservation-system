import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../Components/LoginModal";
export default function Login() {
  const navigate = useNavigate();
  const close = useCallback(() => navigate("/"), [navigate]);
  return <LoginModal standalone onClose={close} />;
}