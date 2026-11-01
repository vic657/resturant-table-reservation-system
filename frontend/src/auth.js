import axiosClient from "./axiosClient";
export const dashboardPaths = {
  admin: "/admin/dashboard",
  kitchen_manager: "/kitchen-manager/dashboard",
  waiter: "/waiter/dashboard",
  security: "/security/dashboard",
  accountant: "/accountant/dashboard",
};
export function clearAuth() {
  ["token", "user", "role"].forEach(key => localStorage.removeItem(key));
}
export function getUser() {
  try { return JSON.parse(localStorage.getItem("user")) || null; }
  catch { clearAuth(); return null; }
}
export async function logout() {
  try { await axiosClient.post("/logout"); }
  finally { clearAuth(); }
}