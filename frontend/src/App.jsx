import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import BookTable from "./pages/BookTable.jsx"; 
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Waiters from "./pages/Waiters";
import Security from "./pages/Security";
import Accountant from "./pages/Accountant";
import KitchenManager from "./pages/KitchenManager";
import KitchenManagerDashboard from "./pages/KitchenManagerDashboard";
import Menu from "./Pages/Menu";
import Receipt from "./pages/Receipt";

// ✅ Import dashboards
import WaiterDashboard from "./pages/WaiterDashboard";
import SecurityDashboard from "./pages/SecurityDashboard";
import AccountantDashboard from "./pages/AccountantDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Admin Support Pages */}
        <Route path="/waiters" element={<Waiters />} />
        <Route path="/admin/support/waiters" element={<Waiters />} />
        <Route path="/admin/security" element={<Security />} />
        <Route path="/admin/accountant" element={<Accountant />} />
        <Route path="/admin/kitchen-manager" element={<KitchenManager />} />

        {/* Individual Dashboards */}
        <Route path="/kitchen-manager/dashboard" element={<KitchenManagerDashboard />} />
        <Route path="/waiter/dashboard" element={<WaiterDashboard />} />
        <Route path="/security/dashboard" element={<SecurityDashboard />} />
        <Route path="/accountant/dashboard" element={<AccountantDashboard />} />

        {/* Public Page */}
        <Route path="/book-table" element={<BookTable />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/receipt/:receiptCode" element={<Receipt />} />
      </Routes>
    </Router>
  );
}

export default App;
