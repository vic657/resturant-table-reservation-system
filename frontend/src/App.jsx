import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BookTable from "./pages/BookTable";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Waiters from "./pages/Waiters";
import Security from "./pages/Security";
import Accountant from "./pages/Accountant";
import KitchenManager from "./pages/KitchenManager";
import KitchenManagerDashboard from "./pages/KitchenManagerDashboard";
import Menu from "./pages/menu";
import Receipt from "./pages/Receipt";
import WaiterDashboard from "./pages/WaiterDashboard";
import SecurityDashboard from "./pages/SecurityDashboard";
import AccountantDashboard from "./pages/AccountantDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
function App() {
  const protect = (role, page) => <ProtectedRoute roles={[role]}>{page}</ProtectedRoute>;
  return <BrowserRouter><Routes>
    <Route path="/" element={<LandingPage />} /><Route path="/login" element={<Login />} />
    <Route path="/admin/dashboard" element={protect("admin", <AdminDashboard />)} />
    {["/waiters", "/admin/support/waiters"].map(path => <Route key={path} path={path} element={protect("admin", <Waiters />)} />)}
    <Route path="/admin/security" element={protect("admin", <Security />)} />
    <Route path="/admin/accountant" element={protect("admin", <Accountant />)} />
    <Route path="/admin/kitchen-manager" element={protect("admin", <KitchenManager />)} />
    <Route path="/kitchen-manager/dashboard" element={protect("kitchen_manager", <KitchenManagerDashboard />)} />
    <Route path="/waiter/dashboard" element={protect("waiter", <WaiterDashboard />)} />
    <Route path="/security/dashboard" element={protect("security", <SecurityDashboard />)} />
    <Route path="/accountant/dashboard" element={protect("accountant", <AccountantDashboard />)} />
    <Route path="/book-table" element={<BookTable />} /><Route path="/menu" element={<Menu />} />
    <Route path="/receipt/:receiptCode" element={<Receipt />} />
    <Route path="*" element={<div className="not-found"><h1>This table doesn't exist.</h1><Link to="/">Back to home →</Link></div>} />
  </Routes></BrowserRouter>;
}
export default App;